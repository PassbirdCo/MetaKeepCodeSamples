import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";
import { checkAPIKey, getUserWallet } from "../../../helpers/utils.mjs";
import { solidityKeccak256 } from "ethers/lib/utils.js";
import {
  REGISTRATION_FUNCTION_NAME,
  VOTING_FUNCTION_NAME,
} from "./constants.js";

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

/* ************************************************************************* Vote Candidate API EndPoint ************************************************************************* */

app.post("/voteCandidate", async (req, res) => {
  console.log("getConsentToken");
  const result = await voteForCandidate(
    req.body.candidateEmail,
    req.body.asEmail
  );
  res.send(result);
});

/* ************************************************************************* Register Candidate API Endpoint ************************************************************************* */

app.post("/registerCandidature", async (req, res) => {
  console.log("registerCandidature");
  const result = await registerCandidate(req.body.candidateEmail, "voting");
  res.send(result);
});

/* ************************************************************************* Start Server ************************************************************************* */

app.listen(port, () => {
  console.log(`Lambda Invocation server listening at http://localhost:${port}`);
});

/* ************************************************************************** Utility functions *************************************************************** */

// Utility Function to register Candidate using Lambda Invocation API

async function registerCandidate(emailId, reason) {
  console.log("Registering Candidate ...");

  // since the "registerCandidateMethod takes the ethereum address as argument, we need to get the wallet associated with the emailId"

  const userWallet = await getUserWallet(emailId);
  const requestBody = {
    function: {
      name: REGISTRATION_FUNCTION_NAME,
      args: [userWallet],
    },
    lambda: process.env.VOTING_LAMBDA_ADDRESS,
    reason: reason,
  };

  const outcome = await invokeLambdaFunction(requestBody);
  return outcome;
}

// Utility function to vote for candidate using Lambda Invocation consent token.

async function voteForCandidate(candidateEmail, asEmail) {
  console.log("Get Lambda Invocation consent token...");
  /* since the voteForCandidate Method takes the Candidate ID as an argument 
  which is the hash of the candidate's ethereum address, 
  we need to get the wallet associated with the candidateEmail 
  and then hash it to get the candidate ID */

  const candidateWallet = await getUserWallet(candidateEmail);
  const candidateId = solidityKeccak256(["address"], [candidateWallet]);

  const requestBody = {
    function: {
      name: VOTING_FUNCTION_NAME,
      args: [candidateId],
    },
    lambda: process.env.VOTING_LAMBDA_ADDRESS,
    reason: "Voting",
    as: {
      email: asEmail,
    },
  };

  const outcome = await invokeLambdaFunction(requestBody);
  return outcome;
}

// Utility function to invoke Lambda Function through MetaKeep Lambda Invocation API.

async function invokeLambdaFunction(requestBody) {
  const url = "https://api.metakeep.xyz/v2/app/lambda/invoke/";
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
