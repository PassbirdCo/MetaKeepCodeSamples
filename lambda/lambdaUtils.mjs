//Helper functions for the MetaKeep APIs

import fetch from "node-fetch";
import { exit } from "process";

// Invokes the lambda function.
export default async function invoke(functionName, functionArgs, reason) {
  const url = "https://api.metakeep.xyz/v2/app/lambda/invoke";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };
  const requestBody = {
    lambda: process.env.LAMBDA_ADDRESS,
    function: {
      name: functionName,
      args: functionArgs,
    },
    reason: reason,
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
    console.log(
      "Error while invoking method. HTTP status code: " + result.status
    );
    exit(1);
  }
  return resultJson;
}

export const create = async (args, abi, bytecode) => {
  const url = "https://api.metakeep.xyz/v2/app/lambda/create";

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
    exit(1);
  }

  return resultJson;
};
