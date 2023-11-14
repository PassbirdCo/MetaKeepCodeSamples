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
import Web3 from "@solana/web3.js";
import nacl from "tweetnacl";
import { getLambdaSponsor } from "../../../lambda/lambdaUtils.mjs";
const app = express();

env.config();

checkAPIKey();

const port = 3001;

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
  try {
    const result = await invokeMemoLambda(req.body.asEmail, req.body.message);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      error: error.message ? error.message : JSON.stringify(error),
    });
  }
});

app.post("/transferSolForEndUser", async (req, res) => {
  console.log("transferSolForEndUser handler running...");
  try {
    const result = await invokeTransferSolLambda(
      req.body.asEmail,
      req.body.to,
      req.body.amount
    );
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

// Utility function to invoke Lambda Function through MetaKeep Lambda Invocation API.

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

  const outcome = await invokeLambdaFunction(requestBody);
  return outcome;
}

// Utility function to invoke Lambda Function through MetaKeep Lambda Invocation API.

async function invokeLambdaFunction(requestBody) {
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

  // Set any fee payer.
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

const invokeTransferSolLambda = async (asEmail, to, amount) => {
  const connection = new Web3.Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  let tx = new Web3.Transaction();
  const amountInt = Number(amount);
  const payer = await getLambdaSponsor();
  console.log("payer: ", payer.wallet.solAddress);

  tx.feePayer = new Web3.PublicKey(payer.wallet.solAddress);

  tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

  const solAddress = await getUserSolAddress(asEmail);
  const recieverSolAddress = await getUserSolAddress(to);

  tx.add(
    Web3.SystemProgram.transfer({
      fromPubkey: new Web3.PublicKey(solAddress),
      toPubkey: new Web3.PublicKey(recieverSolAddress),
      lamports: Web3.LAMPORTS_PER_SOL * amountInt,
    })
  );

  // create a new keypair for the second transfer
  const newAccount = Web3.Keypair.generate();
  console.log("new account", newAccount.publicKey.toBase58());
  tx.add(
    Web3.SystemProgram.transfer({
      fromPubkey: newAccount.publicKey,
      toPubkey: new Web3.PublicKey(
        "3kQpXruMDjfq8YQGp744i4GCJ5VA39KdU8u55MzVo1QZ"
      ),
      lamports: Web3.LAMPORTS_PER_SOL * amountInt,
    })
  );

  // sign the transaction
  let realDataNeedToSign = tx.serializeMessage();
  let newAccountSignature = nacl.sign.detached(
    realDataNeedToSign,
    newAccount.secretKey
  );

  tx.addSignature(newAccount.publicKey, Buffer.from(newAccountSignature));

  const hexSignature = "0x" + Buffer.from(newAccountSignature).toString("hex");

  const requestBody = {
    serializedTransactionMessage: "0x" + realDataNeedToSign.toString("hex"),
    signatures: [
      {
        publicKey: newAccount.publicKey.toBase58(),
        signature: hexSignature,
      },
    ],
    reason: "Transfer Sol Program",
    as: {
      email: asEmail,
    },
  };

  const outcome = await invokeLambdaFunction(requestBody);

  return outcome;
};
