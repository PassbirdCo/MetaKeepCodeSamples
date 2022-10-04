// Script to deploy Smart contract using Metakeep Lambda and REST API.
import fetch from "node-fetch";
import fs from "fs";
import env from "dotenv";
import { exit } from "process";
import getDeveloperWallet, {
  checkAPIKey,
  waitUntilTransactionMined,
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
    fs.readFileSync(
      "../smart-contracts/artifacts/contracts/Voting.sol/Voting.json"
    )
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

  if (!result.ok) {
    console.log(
      "Error while creating lambda. HTTP status code: " + result.status
    );
    exit(1);
  }

  //Waits for the transaction to be mined.

  await waitUntilTransactionMined(resultJson);

  console.log(
    "Lambda created successfully. Lambda address: " + resultJson.lambda
  );
}

main();
