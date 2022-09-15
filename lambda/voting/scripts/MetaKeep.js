import fetch from "node-fetch";
import Web3 from 'web3'; 
import fs from 'fs';
import env from 'dotenv';

async function main() {
    env.config();
const url = 'https://api.dev.metakeep.xyz/v2/app/lambda/create';

const data = JSON.parse(
    fs.readFileSync(
        "../artifacts/contracts/Voting.sol/Voting.json"
));

const web3 = new Web3(process.env.RPC_ENDPOINT);
const contract = new web3.eth.Contract(data["abi"]);

const creationSignature = contract.deploy({
    data: data["bytecode"],
    arguments: [
      process.env.DEVELOPER_ADDRESS, process.env.DEVELOPER_ADDRESS,
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
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  },
  body: JSON.stringify(request_body)
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));
}

main();