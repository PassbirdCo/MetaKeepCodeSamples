// Script to deploy Smart contract using Metakeep Lambda and REST API.
import fetch from "node-fetch";
import fs from "fs";
import env from "dotenv";
import { exit } from "process";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getDeveloperWallet() {
  const url = "https://api.metakeep.xyz/v3/getDeveloperWallet";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
  };
  const options = {
    method: "POST",
    headers: headers,
  };
  const result = await fetch(url, options);
  console.log("getting wallet...");
  return result.json().then((json) => {
    console.log(json);
    return json.wallet.ethAddress;
  });
}

async function getTransactionStatus(transactionId) {
  const url = "https://api.metakeep.xyz/v2/app/transaction/status";
  const requestBody = {
    transactionId: transactionId,
  };
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  const result = await fetch(url, options);
  return result.json().then((json) => {
    return json;
  });
}

async function main() {
  env.config();

  if (process.env.API_KEY == "") {
    console.log("Please set API_KEY in .env file");
    exit(1);
  }

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

  let transactionId;

  await result.json().then(async (json) => {
    // fetches the transaction status, if the lambda creation transaction is Queued.
    if (json.status == "QUEUED") {
      console.log("Lambda creation queued");
      transactionId = json.transactionId;
      // Logs the queued transaction object
      console.log(json);

      console.log("Waiting for transaction to be mined...");

      let transactionStatus;
      for (let i = 0; i < 10; i++) {
        await sleep(5000);
        transactionStatus = await getTransactionStatus(transactionId);
        if (transactionStatus.status == "COMPLETED") {
          console.log("Lambda created successfully");
          exit(0);
        }
      }
      // if the lambda creation transaction is not Queued, logs the error and exits the program.
    } else {
      console.log(json);
      console.log("Lambda creation failed");
    }
  }).setTimeout(10000, () => {
    console.log("Lambda creation timed out");
  });
}

main();
