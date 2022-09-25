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
  const developer_address = await getDeveloperWallet();

  const requestBody = {
    constructor: {
      args: [developer_address, "lambda_name"],
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

  const result = await fetch(url, options).catch(() => {
    exit(1);
  });

  let transactionId;
<<<<<<< HEAD:lambda/voting/scripts/create.mjs

  await result.json().then(async (json) => {
    // fetches the transaction status, if the lambda creation transaction is Queued.
    if (json.status == "QUEUED") {
      console.log("Lambda creation queued");
      transactionId = json.transactionId;
      console.log(json)
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
    } else {
      // logs the error and exits the program.
      console.log(json);
      console.log("Lambda creation failed");
    }
  });
=======
  await result.json().then((json) => {
    console.log(json);
    transactionId = json.transactionId;
  });

  console.log("Waiting for transaction to be mined...");
  let transactionStatus;
  for (let i = 0; i < 10; i++) {
    await sleep(5000);
    transactionStatus = await getTransactionStatus(transactionId);
    if (transactionStatus.status == "COMPLETED") {
      console.log("Lambda created successfully");
      break;
      exit(0);
    }
console.log("Timed out waiting for transaction to be mined.")
console.log("You can track transaction status here: " + url)
  }
>>>>>>> 3c01fbaf02651eec96e08bedb07fb79ceccbfc60:lambda/voting/scripts/create.js
}

main();
