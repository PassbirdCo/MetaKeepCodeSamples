import fetch from "node-fetch";
import env from "dotenv";
import { exit } from "process";

import { solidityKeccak256 } from "ethers/lib/utils.js";
import {
  getTransactionStatus,
  getUserWallet,
  sleep,
  checkAPIKey,
} from "./utils.mjs";

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
  return resultJson;
}

async function waitUntilTransactionMined(resultJson) {
  let transactionStatus;

  console.log("Waiting for transaction to be mined...\n");

  // Waits for 5 seconds and checks the transaction status for 10 times.
  for (let i = 0; i < 10; i++) {
    await sleep(5000);
    transactionStatus = await getTransactionStatus(resultJson.transactionId);
    if (transactionStatus.status == "COMPLETED") {
      console.log("Lambda invocation completed: " + resultJson.transactionHash);
      break;
    } else if (transactionStatus.status == "FAILED") {
      console.log(
        "Lambda invocation failed, Pls check here for more details: " +
          resultJson.transactionChainScanUrl +
          "\n"
      );
      exit(0);
    }
  }
  // If the transaction is not mined after 10 checks, then it is taking more time than expected.
  if (transactionStatus.status == "QUEUED") {
    console.log("Transaction taking more time than expected to confirm.");
    console.log(
      "Please check transaction status at this link:" +
        resultJson.transactionChainScanUrl
    );
    exit(1);
  }
}

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  // Gets the user Address to register as Candidate in Voting contract.
  const userAddress = await getUserWallet("adityadhir97@gmail.com");

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
