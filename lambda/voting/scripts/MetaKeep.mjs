import fetch from "node-fetch";
import Web3 from 'web3'; 
import fs from 'fs';
import env from 'dotenv';

async function getDeveloperWallet() {
  const url = "https://api.dev.metakeep.xyz/v3/getDeveloperWallet";
  const request_body = {
    "user": {"developer_email": process.env.DEVELOPER_EMAIL}
  }
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-api-key": process.env.METAKEEP_API_KEY
  };
  const options = {
    method: 'POST',
    headers: headers,
    body : JSON.stringify(request_body)
  };
  const result = await fetch(url, options);
  console.log("getting wallet...")
  return result.json().then(json => json.wallet.ethAddress);
}

async function getTransactionStatus(transaction_id) {
  const url = "https://api.dev.metakeep.xyz/v2/app/transaction/status";
  const request_body = {
    "transaction_id": transaction_id
}
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-api-key": process.env.METAKEEP_API_KEY
  };
  const options = {
    method: 'POST',
    headers: headers,
    body : JSON.stringify(request_body)
  };
  const result = await fetch(url, options);
  console.log(result)
  return result.json().then(json => console.log(json));
}

async function main() {
    env.config();
const url = 'https://api.dev.metakeep.xyz/v2/app/lambda/create';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-api-key': process.env.API_KEY,
  "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
}

const data = JSON.parse(
    fs.readFileSync(
        "artifacts/contracts/Voting.sol/Voting.json",
));

const web3 = new Web3(process.env.RPC_ENDPOINT);
const contract = new web3.eth.Contract(data["abi"]);
const developer_address = await getDeveloperWallet();

const creationSignature = contract.deploy({
    data: data["bytecode"],
    arguments: [
      developer_address,
      "Voting"
    ]
}).encodeABI();



const request_body = {
    "creationSignature" : creationSignature,
    "abi" : data["abi"],
    "bytecode" : data["bytecode"],

}
const options = {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(request_body)
};
console.log("Lambda creation in process...");

const result = await fetch(url, options).catch(err => console.log(err));
let transaction_id;
await result.json().then(json => {
  console.log(json)
  transaction_id = json.transactionId
});

await getTransactionStatus(transaction_id);

}

main();