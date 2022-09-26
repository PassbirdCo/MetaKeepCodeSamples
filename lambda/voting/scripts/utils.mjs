//Helper functions for the MetaKeep APIs

import fetch from "node-fetch";

export default async function getDeveloperWallet() {
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
  return result.json().then((json) => {
    return json;
  });
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
