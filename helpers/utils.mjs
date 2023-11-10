//Helper functions for the MetaKeep APIs

import { exit } from "process";

const getDeveloperWallet = async () => {
  console.log("Getting developer wallet...");

  const url = getAPIHost() + "/v3/getDeveloperWallet";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY
  };
  const options = {
    method: "POST",
    headers: headers
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
  return resultJson.wallet;
};

export default async function getDeveloperEvmAddress() {
  return (await getDeveloperWallet()).ethAddress;
}

export const getDeveloperSolAddress = async () => {
  return (await getDeveloperWallet()).solAddress;
};

export const getDeveloperBusinessWallet = async () => {
  console.log("Getting developer business wallet...");

  const url = getAPIHost() + "/v2/app/lambda/getBusinessWallet";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000)
  };
  const options = {
    method: "POST",
    headers: headers
  };
  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log("Get business wallet response:");
  console.log(resultJson);

  if (!result.ok) {
    console.log(
      "Error getting developer business wallet. HTTP status code: " +
        result.status
    );
    exit(1);
  }

  console.log("\n");
  return resultJson.wallet.ethAddress;
};

const getUserWallet = async email => {
  console.log("Getting user wallet...");

  const url = getAPIHost() + "/v3/getWallet";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY
  };

  const body = {
    user: {
      email: email
    }
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  };
  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log("getUserWallet response:");
  console.log(resultJson);

  if (!result.ok) {
    console.log(
      "Error getting user wallet. HTTP status code: " + result.status
    );
    throw new Error(
      "Error getting user wallet. Response: " + JSON.stringify(resultJson)
    );
  }
  return resultJson.wallet;
};

export const getUserEvmAddress = async email => {
  return (await getUserWallet(email)).ethAddress;
};

export const getUserSolAddress = async email => {
  return (await getUserWallet(email)).solAddress;
};

export const getTransactionStatus = async transactionId => {
  const url = getAPIHost() + "/v2/app/transaction/status";
  const requestBody = {
    transactionId: transactionId
  };
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody)
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

// Waits for the transaction to be mined.
export const waitUntilTransactionMined = async resultJson => {
  let transactionStatus;

  console.log("Waiting for transaction to be mined...\n");

  // Waits for 5 seconds and checks the transaction status for 10 times.
  for (let i = 0; i < 10; i++) {
    await sleep(5000);
    transactionStatus = await getTransactionStatus(resultJson.transactionId);
    if (transactionStatus.status == "COMPLETED") {
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
};

export const sleep = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const checkAPIKey = () => {
  if (process.env.API_KEY == "") {
    console.log("Please set API_KEY in .env file");
    exit(1);
  }
};

export const getAPIHost = () => {
  return process.env.API_HOST || "https://api.dev.metakeep.xyz";
};
