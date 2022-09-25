import fetch from "node-fetch";
import Web3 from "web3";
import fs from "fs";
import env from "dotenv";

async function getDeveloperWallet() {
  const url = "https://api.dev.metakeep.xyz/v3/getDeveloperWallet";
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

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTransactionStatus(transaction_id) {
  const url = "https://api.dev.metakeep.xyz/v2/app/transaction/status";
  const requestBody = {
    transaction_id: transaction_id,
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
  const url = "https://api.dev.metakeep.xyz/v2/app/lambda/create";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };

  const data = JSON.parse(
    fs.readFileSync("artifacts/contracts/Voting.sol/Voting.json")
  );

  const web3 = new Web3();
  const contract = new web3.eth.Contract(data["abi"]);
  const developer_address = await getDeveloperWallet();

  const creationSignature = contract
    .deploy({
      data: data["bytecode"],
      arguments: [developer_address, "Voting"],
    })
    .encodeABI();

  const requestBody = {
    creationSignature: creationSignature,
    abi: data["abi"],
    bytecode: data["bytecode"],
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  console.log("Lambda creation in process...");

  const result = await fetch(url, options).catch((err) => {
    console.log(err);
    return err;
  });
  let transactionId;
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
  }
}

main();
