// Script to deploy Smart contract using Metakeep Lambda and REST API.
import fetch from "node-fetch";
import fs from "fs";
import env from "dotenv";
import { exit } from "process";
import getDeveloperWallet, {
  getTransactionStatus,
  sleep,
  checkAPIKey,
} from "../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  const url = "https://api.metakeep.xyz/v2/app/lambda/create";

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
    constructor: {
      args: [developerAddress, "lambda_name"],
    },
    abi: data["abi"],
    bytecode: data["bytecode"],
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  console.log("Lambda creation in process...");

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log("Lambda creation response:");
  console.log(resultJson);

  let transactionId;

  if (resultJson.status != "QUEUED") {
    // if the lambda creation transaction is not Queued, logs the error and exits the program.
    console.log("Lambda creation failed");
  }

  console.log("Lambda creation queued\n");
  transactionId = resultJson.transactionId;

  console.log("Waiting for transaction to be mined...");

  let transactionStatus;

  // Waits for 5 seconds and checks the transaction status for 10 times.
  for (let i = 0; i < 10; i++) {
    await sleep(5000);
    transactionStatus = await getTransactionStatus(transactionId);
    if (transactionStatus.status == "COMPLETED") {
      console.log(
        "Lambda created successfully at address: " + resultJson.lambda
      );
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
