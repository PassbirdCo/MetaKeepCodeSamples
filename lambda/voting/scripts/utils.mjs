//Helper functions for the MetaKeep APIs

import fetch from "node-fetch";
import { exit } from "process";

export default async function getDeveloperWallet() {
  console.log("Getting developer wallet...");

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
  const resultJson = await result.json();

  console.log("getDeveloperWallet response:");
  console.log(resultJson);

  if (!result.ok) {
    console.log(
      "Error getting developer wallet. HTTP status code: " + result.status
    );
    exit(1);
  }

  console.log("\n");
  return resultJson.wallet.ethAddress;
}

export const getUserWallet = async (email) => {
  console.log("Getting user wallet...");

  const url = "https://api.metakeep.xyz/v3/getWallet";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
  };

  const body = {
    user: {
      email: email,
    },
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };
  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log("getUserWallet response:");
  console.log(resultJson);

  if (!result.ok) {
    console.log(
      "Error getting user wallet. HTTP status code: " + result.status
    );
    exit(1);
  }

  console.log("\n");
  return resultJson.wallet.ethAddress;
};

export const getTransactionStatus = async (transactionId) => {
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
  const resultJson = await result.json();

  console.log("getTransactionStatus response: ");
  console.log(resultJson);

  if (!result.ok) {
    console.log("Error getting transaction status");
    exit(1);
  }

  console.log("\n");

  return resultJson;
};

export const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const checkAPIKey = () => {
  if (process.env.API_KEY == "") {
    console.log("Please set API_KEY in .env file");
    exit(1);
  }
};
