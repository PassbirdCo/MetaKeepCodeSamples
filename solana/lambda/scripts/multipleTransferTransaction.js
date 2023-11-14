import env from "dotenv";
import { getLambdaSponsor } from "../../../lambda/lambdaUtils.mjs";
import {
  waitUntilTransactionMined,
  checkAPIKey,
  getAPIHost,
} from "../../../helpers/utils.mjs";
import { getDeveloperSolAddress } from "../../../helpers/utils.mjs";

import Web3 from "@solana/web3.js";
import nacl from "tweetnacl";
async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  /* *************************************************************** Invoke System Program *************************************************************** */
  console.log(
    "***************************************************** Invoke System Program *****************************************************\n"
  );

  console.log("Invoke solana transaction with multiple signatures...\n");
  const developerSolAddress = await getDeveloperSolAddress();
  console.log("Developer Solana Address: " + developerSolAddress);

  const request = await transferSerializedTransaction(developerSolAddress);

  const url = getAPIHost() + "/v2/app/lambda/invoke";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": Math.floor(Math.random() * 10000),
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(request),
  };

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log(resultJson);

  if (!result.ok) {
    throw new Error(
      "Error while invoking method. HTTP status code: " + result.status
    );
  }

  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for memo program completed: " +
      result.transactionSignature +
      "\n"
  );
}

const transferSerializedTransaction = async (from) => {
  const connection = new Web3.Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  let tx = new Web3.Transaction();
  // make a http request to get metakeep fee payer

  const payer = await getLambdaSponsor();
  console.log("payer: ", payer.wallet.solAddress);

  tx.feePayer = new Web3.PublicKey(payer.wallet.solAddress);

  tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

  tx.add(
    Web3.SystemProgram.transfer({
      fromPubkey: new Web3.PublicKey(from),
      toPubkey: new Web3.PublicKey(
        "3kQpXruMDjfq8YQGp744i4GCJ5VA39KdU8u55MzVo1QZ"
      ),
      lamports: Web3.LAMPORTS_PER_SOL / 1000,
    })
  );

  // create a new keypair
  const newAccount = Web3.Keypair.generate();
  console.log("new account", newAccount.publicKey.toBase58());
  tx.add(
    Web3.SystemProgram.transfer({
      fromPubkey: newAccount.publicKey,
      toPubkey: new Web3.PublicKey(
        "3kQpXruMDjfq8YQGp744i4GCJ5VA39KdU8u55MzVo1QZ"
      ),
      lamports: Web3.LAMPORTS_PER_SOL / 1000,
    })
  );

  // sign the transaction
  let realDataNeedToSign = tx.serializeMessage();
  let newAccountSignature = nacl.sign.detached(
    realDataNeedToSign,
    newAccount.secretKey
  );

  tx.addSignature(newAccount.publicKey, Buffer.from(newAccountSignature));

  const hexSignature = "0x" + Buffer.from(newAccountSignature).toString("hex");

  const request = {
    serialized_transaction_message: "0x" + realDataNeedToSign.toString("hex"),
    signatures: [
      {
        publicKey: newAccount.publicKey.toBase58(),
        signature: hexSignature,
      },
    ],
    reason: "test",
  };

  return request;
};

main();
