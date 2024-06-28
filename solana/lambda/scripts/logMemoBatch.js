import env from "dotenv";
import {
  getLambdaSponsor,
  invokeLambdaMultiple,
} from "../../../lambda/lambdaUtils.mjs";
import {
  waitUntilTransactionMined,
  checkAPIKey,
} from "../../../helpers/utils.mjs";
import Web3, { ComputeBudgetProgram } from "@solana/web3.js";
import { getDeveloperSolAddress } from "../../../helpers/utils.mjs";

const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  /* ****************************** Batch Invoke Memo Program ********************************* */
  console.log(
    "****************************** Batch Invoke Memo Program *********************************\n"
  );

  // Invokes the Solana memo program.
  console.log("Invoking batch log Memo Program on Solana...\n");
  let developerSolAddress = await getDeveloperSolAddress();
  console.log("Developer Solana Address: " + developerSolAddress);

  const result = await invokeLambdaMultiple({
    invocations: await logBatchMemos(
      ["log 1", "log 2", "log 3"],
      developerSolAddress
    ),
    description: { text: "Invoke Log Memo Program on Solana" },
  });

  console.log("Batch Lambda invocation for log memo sent.");

  // Waits for all the transactions to be mined.
  for (let i = 0; i < result.transactions.length; i++) {
    await waitUntilTransactionMined(result.transactions[i], 1);
  }

  console.log(
    "Batch lambda invocation for memo program completed: " +
      result.transactions +
      "\n"
  );
}

const logBatchMemos = async (messages, from) => {
  // Get MetaKeep Lambda Fee Sponsor Solana Address
  const payer = (await getLambdaSponsor()).wallet.solAddress;
  console.log("Fee payer: ", payer);

  let invocations = [];

  for (let i = 0; i < messages.length; i++) {
    let tx = new Web3.Transaction();

    // Set fee payer as the from address.
    // It will be overridden by MetaKeep lambda infrastructure to a different sponsoring account.
    tx.feePayer = new Web3.PublicKey(payer);

    // Set any blockhash.
    // It will be overridden by MetaKeep lambda infrastructure to the most recent blockhash.
    tx.recentBlockhash = "3Epnu1Sb1bDqHwieG1o4Dj4XeFAUjHKD3reYPUFVoRaJ";

    // Set the compute price.
    // You can set this to any value. MetaKeep Solana Lambda infrastructure will reprice the transaction
    // if needed based on the current Solana network conditions.
    tx.add(
      // Add compute price for the transaction.
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 30000,
      })
    );

    // Also, set a compute budget for the transaction to avoid unnecessary fee charges.
    tx.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 40000,
      })
    );

    tx.add(
      new Web3.TransactionInstruction({
        keys: [
          {
            pubkey: new Web3.PublicKey(from),
            isSigner: true,
            isWritable: false,
          },
        ],
        data: Buffer.from(messages[i], "utf8"),
        programId: new Web3.PublicKey(MEMO_PROGRAM_ID),
      })
    );

    const serializedMessage = "0x" + tx.serializeMessage().toString("hex");

    invocations.push({
      serializedTransactionMessage: serializedMessage,
      description: {
        text: "Invoke Log Memo Program on Solana with reason: " + messages[i],
      },
    });
  }

  return invocations;
};

main();
