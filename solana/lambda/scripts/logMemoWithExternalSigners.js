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

import Web3, { clusterApiUrl } from "@solana/web3.js";
import nacl from "tweetnacl";

const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  /* *************************************************************** Invoke Memo Program *************************************************************** */
  console.log(
    "***************************************************** Invoke Memo Program *****************************************************\n"
  );

  console.log("Invoke solana transaction with multiple signatures...\n");
  const developerSolAddress = await getDeveloperSolAddress();
  console.log("Developer Solana Address: " + developerSolAddress);

  const request = await logMemoMultipleSignersRequest(
    developerSolAddress,
    "METAKEEP LAMBDA TUTORIAL"
  );

  const resultJson = await invokeSolana(
    request.serializedTransactionMessage,
    request.reason,
    request.signatures
  );

  await waitUntilTransactionMined(resultJson, 1);
  console.log(
    "Lambda invocation for memo program completed: " +
      resultJson.transactionSignature +
      "\n"
  );
}

const logMemoMultipleSignersRequest = async (from, message) => {
  // Get MetaKeep Lambda Fee Sponsor Solana Address
  const payer = await getLambdaSponsor();
  console.log("Fee payer: ", payer.wallet.solAddress);

  let tx = new Web3.Transaction();
  tx.feePayer = new Web3.PublicKey(payer.wallet.solAddress);

  // Get most recent blockhash
  // This needs to be filled in since there are external signers too.
  const connection = new Web3.Connection(clusterApiUrl("devnet"), "confirmed");
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
      programId: new Web3.PublicKey(MEMO_PROGRAM_ID),
    })
  );

  // Simulate external signer by generating a new keypair
  const externalSigner = Web3.Keypair.generate();
  console.log("External signer", externalSigner.publicKey.toBase58());

  tx.add(
    new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: externalSigner.publicKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from(message, "utf8"),
      programId: new Web3.PublicKey(MEMO_PROGRAM_ID),
    })
  );

  // Sign the transaction with the external signer
  let messageToSign = tx.serializeMessage();
  let externalSignerSignature = nacl.sign.detached(
    messageToSign,
    externalSigner.secretKey
  );

  const externalSignerHexSignature =
    "0x" + Buffer.from(externalSignerSignature).toString("hex");

  // Create MetaKeep Lambda invocation request
  const request = {
    // The transaction message to be signed by you(the developer).
    serializedTransactionMessage: "0x" + messageToSign.toString("hex"),
    // List of external signers and their signatures.
    signatures: [
      {
        publicKey: externalSigner.publicKey.toBase58(),
        signature: externalSignerHexSignature,
      },
    ],
    reason: "MetaKeep Lambda Tutorial",
  };

  return request;
};

main();
