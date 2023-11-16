//Helper functions for the MetaKeep APIs

import { getAPIHost } from "../helpers/utils.mjs";
// Creates a Lambda.
export const create = async (args, abi, bytecode, name) => {
  const url = getAPIHost() + "/v2/app/lambda/create";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };

  const requestBody = {
    constructor: {
      args: args,
    },
    abi: abi,
    name: name || "",
    bytecode: bytecode,
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
    throw new Error(
      "Error while creating lambda. HTTP status code: " + result.status
    );
  }

  return resultJson;
};

export const importLambda = async (abi, name, address) => {
  const url = getAPIHost() + "/v2/app/lambda/import";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
  };

  const requestBody = {
    abi: abi,
    name: name,
    lambda: address,
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };

  console.log("Lambda import in process...");

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log("Lambda import response:");
  console.log(resultJson);

  if (!result.ok) {
    console.log(
      "Error while importing lambda. HTTP status code: " + result.status
    );
    throw new Error(
      "Error while importing lambda. HTTP status code: " + result.status
    );
  }

  return resultJson;
};

// Invokes the lambda function.
export const invoke = async (
  functionName,
  functionArgs,
  reason,
  lambdaAddress,
  value,
  useBusinessWallet
) => {
  const url = getAPIHost() + "/v2/app/lambda/invoke";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };
  const requestBody = {
    lambda: lambdaAddress || process.env.LAMBDA_ADDRESS,
    function: {
      name: functionName,
      args: functionArgs,
    },
    pay: value || "0",
    reason: reason,
    using: useBusinessWallet ? "BUSINESS_WALLET" : null,
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log(resultJson);

  if (!result.ok) {
    throw new Error(
      "Error while invoking method. HTTP status code: " + result.status
    );
  }
  return resultJson;
};

// Invokes the lambda function.
export const invokeSolana = async (
  serializedTransactionMessage,
  reason,
  signatures = []
) => {
  const url = getAPIHost() + "/v2/app/lambda/invoke";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };
  const requestBody = {
    serializedTransactionMessage: serializedTransactionMessage,
    reason: reason,
    signatures: signatures,
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log(resultJson);

  if (!result.ok) {
    throw new Error(
      "Error while invoking method. HTTP status code: " + result.status
    );
  }
  return resultJson;
};

export const getLambdaSponsor = async () => {
  const url = getAPIHost() + "/v2/app/lambda/getSponsor";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({}),
  };

  const result = await fetch(url, options);

  const resultJson = await result.json();

  if (!result.ok) {
    console.log(
      "Error while getting lambda sponsor. HTTP status code: " + result.status
    );
    throw new Error(
      "Error while getting lambda sponsor. HTTP status code: " + result.status
    );
  }

  return resultJson;
};

// Invokes multiple lambdas.
export const invokeMultiple = async (invocations, reason, as) => {
  const url = getAPIHost() + "/v2/app/lambda/invoke/multiple";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };
  const requestBody = {
    invocations: invocations,
    reason: reason,
    using: "BUSINESS_WALLET",
    as: as || null,
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log(resultJson);

  if (!result.ok) {
    throw new Error(
      "Error while invoking method. HTTP status code: " + result.status
    );
  }
  return resultJson;
};

export const updateABI = async (lambdaAddress, abi) => {
  const url = getAPIHost() + "/v2/app/lambda/update";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
  };

  const requestBody = {
    lambda: lambdaAddress,
    abi: abi,
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };

  console.log("Updating ABI in process...");

  const result = await fetch(url, options);

  if (!result.ok) {
    console.log("Error while updating ABI. HTTP status code: " + result.status);
    throw new Error(
      "Error while updating ABI. HTTP status code: " + result.status
    );
  }

  console.log("ABI updated successfully.");
};

export const getMergedABI = (implementationABI, proxyABI) => {
  // Remove constructor from implementation ABI
  const abi = implementationABI.filter((item) => {
    return item.type !== "constructor";
  });
  const mergedABI = abi.concat(proxyABI);
  return mergedABI;
};

export const readLambda = async (lambdaAddress, functionName, functionArgs) => {
  const url = getAPIHost() + "/v2/app/lambda/read";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.random().toString(),
  };

  const requestBody = {
    lambda: lambdaAddress,
    function: {
      name: functionName,
      args: functionArgs,
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  const result = await fetch(url, options);
  const resultJson = await result.json();
  console.log("Lambda read response: ");
  console.log(resultJson);
  if (!result.ok) {
    console.log(
      "Error reading from Lambda Function. HTTP status code: " + result.status
    );
  }
  console.log("\n");
  return resultJson;
};
