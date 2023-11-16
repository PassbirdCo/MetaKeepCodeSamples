import env from "dotenv";
import {
  getLambdaSponsor,
  invokeSolana,
} from "../../../lambda/lambdaUtils.mjs";
import {
  waitUntilTransactionMined,
  checkAPIKey,
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

  const request = await logMemoMultipleSerializedTransaction(
    developerSolAddress,
    "METAKEEP TUTORIAL"
  );

  const resultJson = await invokeSolana(
    request.serialized_transaction_message,
    request.reason,
    request.signatures
  );

  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for memo program completed: " +
      resultJson.transactionSignature +
      "\n"
  );
}

const logMemoMultipleSerializedTransaction = async (from, message) => {
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
    new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: new Web3.PublicKey(from),
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from(message, "utf8"),
      programId: new Web3.PublicKey(
        "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
      ),
    })
  );

  // create a new keypair
  const newAccount = Web3.Keypair.generate();
  console.log("new account", newAccount.publicKey.toBase58());

  tx.add(
    new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: newAccount.publicKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from(message, "utf8"),
      programId: new Web3.PublicKey(
        "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
      ),
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
