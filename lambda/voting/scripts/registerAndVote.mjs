import fetch from "node-fetch";
import env from "dotenv";
import { exit } from "process";

import { solidityKeccak256 } from "ethers/lib/utils.js";
import {
  waitUntilTransactionMined,
  getUserWallet,
  sleep,
  checkAPIKey,
} from "./utils.mjs";

// Invokes the lambda function.
async function invoke(functionName, functionArgs) {
  const url = "https://api.metakeep.xyz/v2/app/lambda/invoke";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };
  const requestBody = {
    lambda: process.env.LAMBDA_ADDRESS,
    function: {
      name: functionName,
      args: functionArgs,
    },
    reason: "vote",
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log(resultJson);

  if (!result.ok) {
    console.log(
      "Error while invoking method. HTTP status code: " + result.status
    );
    exit(1);
  }
  return resultJson;
}

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  // Gets the user Address to register as Candidate in Voting contract.
  const userAddress = await getUserWallet(process.env.REGISTER_CANDIDATE_EMAIL);

  /* *************************************************************** Register Candidate *************************************************************** */
  console.log(
    "***************************************************** Register Candidate *****************************************************\n"
  );
  // Invokes the lambda function to register the user as candidate.
  console.log("Invoking lambda function to register candidate...\n");
  const resultJson = await invoke("registerCandidate", [userAddress]);
  console.log("Lambda invocation for registering user initiated: \n");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for registering user completed: " +
      resultJson.transactionHash +
      "\n"
  );

  // Waits for 5 seconds.
  sleep(5000);

  /* *************************************************************** Vote Candidate *************************************************************** */
  console.log(
    "***************************************************** Vote Candidate *****************************************************\n"
  );

  // Gets the Candidate ID to vote for the candidate.
  const candidateId = solidityKeccak256(["address"], [userAddress]);

  // Invokes the lambda function to vote for the candidate.
  console.log("Invoking lambda function to vote for candidate...\n");
  const resultJson2 = await invoke("voteForCandidate", [candidateId]);
  console.log("Lambda invocation for voting initiated: ");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson2);
  console.log(
    "Lambda invocation for voting completed: " +
      resultJson2.transactionHash +
      "\n"
  );
}

main();
