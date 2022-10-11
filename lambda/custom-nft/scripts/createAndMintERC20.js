// Script to deploy Currency contract using Metakeep Rest APIs

import fetch from "node-fetch";
import env from "dotenv";
import { exit } from "process";
import ethers from "ethers";
import getDeveloperWallet, {
  sleep,
  waitUntilTransactionMined,
  checkAPIKey,
} from "../../../helpers/utils.mjs";

async function createCurrency() {
  const url = "https://api.metakeep.xyz/v2/app/coin/createCurrency";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };

  const developerAddress = await getDeveloperWallet();

  const requestBody = {
    coin: {
      name: "Metakeep_ERC20",
      symbol: "MTKERC20",
    },
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  console.log("Currency creation in process...");

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log("Currency creation response:");

  console.log(resultJson);

  if (!result.ok) {
    // if the currency creation transaction is not Queued, logs the error and exits the program.
    console.log(
      "Currency creation failed. HTTP Status Code: " + resultJson.status
    );
    exit(1);
  }

  return resultJson;
}

async function mintCoins(currency) {
  const url = "https://api.metakeep.xyz/v2/app/coin/mint";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };

  const requestBody = {
    coin: {
      currency: currency,
    },
    to: {
      email: process.env.USER_EMAIL_ADDRESS,
    },
    amount: "100",
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  console.log("Coins minting in process...");

  const result = await fetch(url, options);

  const resultJson = await result.json();

  console.log("Coins minting response:");

  console.log(resultJson);

  if (!result.ok) {
    // if the Coins minting transaction is not Queued, logs the error and exits the program.
    console.log("Coins minting failed. HTTP Status Code: " + resultJson.status);
    exit(1);
  }

  return resultJson;
}

async function main() {
  env.config();

  // check if the API key is set in the environment variables
  checkAPIKey();

  /* *************************************************************** Create Currency *************************************************************** */
  console.log(
    "***************************************************** Create Currency *****************************************************\n"
  );
  // Creates a New Currency
  console.log("Creating a new Currency...");
  const resultJson = await createCurrency();
  console.log("Currency creation in progress...");

  // Waits for the transaction to be mined
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Currency created successfully! Currency Address: " +
      resultJson.currency +
      "\n"
  );

  // Waits for 5 seconds.
  sleep(5000);

  /* *************************************************************** Mint Coins *************************************************************** */
  console.log(
    "***************************************************** Mint Coins *****************************************************\n"
  );

  // Mints a new Coins
  console.log("Minting Coins...");

  const currency = resultJson.currency;

  const mintResultJson = await mintCoins(currency);

  console.log("Coin mint in progress....");

  // Waits for the transaction to be mined

  await waitUntilTransactionMined(mintResultJson);

  console.log(
    "Coins minted successfully! Transaction Hash: " +
      mintResultJson.transactionHash
  );
}

main();
