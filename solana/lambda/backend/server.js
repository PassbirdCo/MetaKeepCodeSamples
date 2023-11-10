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

app.post("/logMemo", async (req, res) => {
  console.log("getConsentToken");
  try {
    const result = await invokeMemoLambda(req.body.asEmail, req.body.message);
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
  console.log("Get Lambda Invocation consent token...");
  const solAddress = await getUserSolAddress(asEmail);
  const serializedTransactionMessageL = await logMemoSerializedMessage(
    message,
    solAddress
  );
  console.log(serializedTransactionMessageL);
  // We will invoke the Lambda Function as the user with the given email address.
  const requestBody = {
    serializedTransactionMessage: serializedTransactionMessageL,
    reason: "Log Memo Program",
    as: {
      email: asEmail,
    },
  };

  const outcome = await invokeLambdaFunction(requestBody);
  console.log(outcome);
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
  const connection = new Web3.Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  let tx = new Web3.Transaction();
  tx.feePayer = new Web3.PublicKey(from);
  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
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
  console.log("tx", tx);
  console.log("tx", "0x" + tx.serializeMessage().toString("hex"));
  return "0x" + tx.serializeMessage().toString("hex");
};
