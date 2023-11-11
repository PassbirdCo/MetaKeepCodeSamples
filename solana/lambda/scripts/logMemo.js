import env from "dotenv";
import { invokeSolana } from "../../../lambda/lambdaUtils.mjs";
import {
  waitUntilTransactionMined,
  checkAPIKey,
} from "../../../helpers/utils.mjs";
import Web3 from "@solana/web3.js";
import { getDeveloperSolAddress } from "../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  /* *************************************************************** Invoke Memo Program *************************************************************** */
  console.log(
    "***************************************************** Invoke Memo Program *****************************************************\n"
  );

  // Invokes the Solana memo program.
  console.log("Invoking log Memo Program on Solana...\n");
  const developerSolAddress = await getDeveloperSolAddress();
  console.log("Developer Solana Address: " + developerSolAddress);
  const result = await invokeSolana(
    await logMemoSerializedMessage(
      "hello world from MetaKeep",
      developerSolAddress
    ),
    "Invoke Log Memo Program on Solana"
  );
  console.log("Lambda invocation for memo program sent.");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(result);
  console.log(
    "Lambda invocation for memo program completed: " +
      result.transactionSignature +
      "\n"
  );
}

const logMemoSerializedMessage = async (message, from) => {
  let tx = new Web3.Transaction();

  // Set any fee payer.
  // It will be overridden by MetaKeep lambda infrastructure to a different sponsoring account.
  tx.feePayer = new Web3.PublicKey(from);

  // Set any blockhash.
  // It will be overridden by MetaKeep lambda infrastructure to the most recent blockhash.
  tx.recentBlockhash = "3Epnu1Sb1bDqHwieG1o4Dj4XeFAUjHKD3reYPUFVoRaJ";
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
  return "0x" + tx.serializeMessage().toString("hex");
};

main();
