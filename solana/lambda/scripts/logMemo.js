import env from "dotenv";
import { invokeSolana } from "../../../lambda/lambdaUtils.mjs";
import {
  waitUntilTransactionMined,
  checkAPIKey,
} from "../../../helpers/utils.mjs";
import Web3 from "@solana/web3.js";
import getDeveloperWallet from "../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  /* *************************************************************** Invoke Memo Program *************************************************************** */
  console.log(
    "***************************************************** Invoke Memo Program *****************************************************\n"
  );

  // Invokes the lambda function of memo program in solana.
  console.log("Invoking log Memo Program on Solana...\n");
  const result = await invokeSolana(
    await logMemoSerializedMessage(
      "hello world from Metakeep",
      await getDeveloperWallet()
    ),
    "Invoke Log Memo Program on Solana"
  );
  console.log("Lambda invocation for memo program initiated: ");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(result);
  console.log(
    "Lambda invocation for memo Program completed: " +
      result.transactionSignature +
      "\n"
  );
}

const logMemoSerializedMessage = async (message, from) => {
  const connection = new Web3.Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  let tx = new Web3.Transaction();
  tx.feePayer = new Web3.PublicKey(from);
  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
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
