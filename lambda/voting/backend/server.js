import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";
import { checkAPIKey } from "../../../helpers/utils.mjs";

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
  res.send("MetaKeep Tutorial Mock Server!");
});

app.post("/getConsentToken", async (req, res) => {
  console.log("getConsentToken");
  const result = await getLambdaInvocationConsentToken(
    req.body.function.args,
    req.body.reason,
    req.body.as.email
  );
  res.send(result);
});
app.listen(port, () => {
  console.log(
    `Lambda Invocation mock server listening at http://localhost:${port}`
  );
});

// Utility function to Lambda Invocation consent token

async function getLambdaInvocationConsentToken(args, reason, toEmail) {
  console.log("Get Lambda Invocation consent token...");
  const url = "https://api.metakeep.xyz/v2/app/lambda/invoke/";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.random().toString(),
  };
  const requestBody = {
    function: {
      name: process.env.FUNCTION_NAME,
      args: args,
    },
    lambda: process.env.LAMBDA,
    reason: reason,
    as: {
      email: toEmail,
    },
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
