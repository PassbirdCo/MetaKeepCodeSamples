import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";
import {
  checkAPIKey,
  getAPIHost,
  getUserSolAddress,
} from "../../../helpers/utils.mjs";
import Web3, { clusterApiUrl } from "@solana/web3.js";
import nacl from "tweetnacl";
import { getLambdaSponsor } from "../../../lambda/lambdaUtils.mjs";
const app = express();

env.config();

checkAPIKey();

const port = 3001;
const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.send("MetaKeep Tutorial Backend Server!");
});

/* ************************************************************************* log Memo API EndPoint ************************************************************************* */

app.post("/logMemoForEndUser", async (req, res) => {
  console.log("logMemoForEndUser handler running...");
  let result;
  try {
    if (!req.body.includeExternalSigners) {
      result = await invokeMemoLambda(req.body.asEmail, req.body.message);
    } else {
      result = await invokeMemoLambdaWithExternalSigners(
        req.body.asEmail,
        req.body.message
      );
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({
      error: error.message ? error.message : JSON.stringify(error),
    });
  }
});

/* ************************************************************************* Start Server ************************************************************************* */

app.listen(port, () => {
  console.log(`Lambda Invocation server listening at http://localhost:${port}`);
});

/* ************************************************************************** Utility functions *************************************************************** */

async function invokeMemoLambda(asEmail, message) {
  console.log("Getting Lambda Invocation consent token...");
  const solAddress = await getUserSolAddress(asEmail);
  const serializedTransactionMessage = await logMemoSerializedMessage(
    message,
    solAddress
  );

  // We will invoke the Lambda Function as the user with the given email address.
  const requestBody = {
    serializedTransactionMessage: serializedTransactionMessage,
    reason: "Log Memo Program",
    as: {
      email: asEmail,
    },
  };

  return await getConsentTokenFromMetaKeep(requestBody);
}

// Utility function to invoke Lambda Function through MetaKeep Lambda Invocation API.
async function getConsentTokenFromMetaKeep(requestBody) {
  const url = getAPIHost() + "/v2/app/lambda/invoke/";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.random().toString(),
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  const result = await fetch(url, options);
  const resultJson = await result.json();
  console.log("Lambda Invocation response: ");
  console.log(resultJson);
  if (!result.ok) {
    console.log(
      "Error invoking Lambda Function. HTTP status code: " + result.status
    );
  }
  console.log("\n");
  return resultJson;
}

const logMemoSerializedMessage = async (message, from) => {
  let tx = new Web3.Transaction();

  // Set fee payer as the from address.
  // It will be overridden by MetaKeep lambda infrastructure to a different sponsoring account.
  tx.feePayer = new Web3.PublicKey(from);

  // Set any blockhash.
  // It will be overridden by MetaKeep lambda infrastructure to the most recent blockhash.
  tx.recentBlockhash = "3Epnu1Sb1bDqHwieG1o4Dj4XeFAUjHKD3reYPUFVoRaJ";

  tx.add(
    new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: new Web3.PublicKey(from),
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from(message, "utf8"),
      programId: new Web3.PublicKey(
        "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
      ),
    })
  );

  return "0x" + tx.serializeMessage().toString("hex");
};

const invokeMemoLambdaWithExternalSigners = async (asEmail, message) => {
  // Get MetaKeep Lambda Fee Sponsor Solana Address
  const payer = await getLambdaSponsor();
  console.log("Fee payer: ", payer.wallet.solAddress);

  let tx = new Web3.Transaction();
  tx.feePayer = new Web3.PublicKey(payer.wallet.solAddress);

  // Get most recent blockhash
  // This needs to be filled in since there are external signers too.
  const connection = new Web3.Connection(clusterApiUrl("devnet"), "confirmed");
  tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

  // Add log memo instruction for the end user
  const userSolAddress = await getUserSolAddress(asEmail);

  tx.add(
    new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: new Web3.PublicKey(userSolAddress),
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from(message, "utf8"),
      programId: new Web3.PublicKey(MEMO_PROGRAM_ID),
    })
  );

  // Simulate external signer by generating a new keypair
  const externalSigner = Web3.Keypair.generate();
  console.log("External signer", externalSigner.publicKey.toBase58());

  tx.add(
    new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: externalSigner.publicKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from(message, "utf8"),
      programId: new Web3.PublicKey(MEMO_PROGRAM_ID),
    })
  );

  // Sign the transaction with the external signer
  let messageToSign = tx.serializeMessage();
  let externalSignerSignature = nacl.sign.detached(
    messageToSign,
    externalSigner.secretKey
  );

  const externalSignerHexSignature =
    "0x" + Buffer.from(externalSignerSignature).toString("hex");

  const requestBody = {
    // The transaction message to be signed by the end user.
    serializedTransactionMessage: "0x" + messageToSign.toString("hex"),
    // List of external signers and their signatures.
    signatures: [
      {
        publicKey: externalSigner.publicKey.toBase58(),
        signature: externalSignerHexSignature,
      },
    ],
    reason: "MetaKeep Lambda Tutorial",
    as: {
      email: asEmail,
    },
  };

  return await getConsentTokenFromMetaKeep(requestBody);
};
