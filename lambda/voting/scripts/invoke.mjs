import fetch from "node-fetch";
import fs from "fs";
import env from "dotenv";
import { exit } from "process";

import getDeveloperWallet, {
  getTransactionStatus,
  sleep,
  checkAPIKey,
} from "./utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  const url = "https://api.metakeep.xyz/v2/app/lambda/invoke";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };

  const data = JSON.parse(
    fs.readFileSync("artifacts/contracts/Voting.sol/Voting.json")
  );
  const developerAddress = await getDeveloperWallet();

  const requestBody = {
    lambda: process.env.LAMBDA_ADDRESS,
    function: {
        "name" : "registerCandidate",
        "args" : [developerAddress]
    },
    reason : "vote",
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  console.log("Lambda invocation in process...");

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log("Lambda invocation response:");
  console.log(resultJson);

  let transactionStatus;

  console.log("Waiting for transaction to be mined...");

  // Waits for 5 seconds and checks the transaction status for 10 times.
  for (let i = 0; i < 10; i++) {
    await sleep(5000);
    transactionStatus = await getTransactionStatus(resultJson.transactionId);
    if (transactionStatus.status == "COMPLETED") {
      console.log("Lambda invocation completed: " + resultJson.transactionHash);
      exit(0);
    }
  }

  console.log("Transaction taking more time than expected to confirm.");
  console.log(
    "Please check transaction status at this link:" +
      resultJson.transactionChainScanUrl
  );
}

main();
