// This tutorial focuses on use of Metakeep getWallet API and signTransaction API.

import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import axios from "axios";
import bs58 from "bs58";
import nacl from "tweetnacl";
import env from "dotenv";

env.config();

const METAKEEP_HOST = "api.metakeep.xyz";

const checkApiKey = () => {
  if (!process.env.API_KEY) {
    console.log("Please set API_KEY in .env file");
    exit(1);
  }
};

const getWallet = async () => {
  console.log("Getting wallet address...");
  console.log("API_KEY: ", process.env.API_KEY);
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
  };

  const apiConfig = {
    method: "POST",
    url: `https://${METAKEEP_HOST}/v3/getDeveloperWallet`,
    headers: headers,
  };

  const response = await axios(apiConfig);

  if (response.data.error) {
    console.log(response.data.error);
    exit(1);
  } else if (response.data.wallet) {
    console.log("Wallet address: ", response.data.wallet.solAddress);
  }
  return response.data.wallet.solAddress;
};

const signTransaction = async (transaction) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
  };

  const apiConfig = {
    method: "POST",
    url: `https://${METAKEEP_HOST}/v2/app/sign/transaction`,
    headers: headers,
    data: {
      transactionObject: {
        serializedTransactionMessage: transaction.toString("hex"),
      },
      reason: "Transfer SOL",
    },
  };

  const response = await axios(apiConfig);

  if (response.data.error) {
    console.log(response.data.error);
    exit(1);
  } else if (response.data.signature) {
    console.log("Transaction signed");
  }

  return response.data;
};

const transferTokens = async (amount) => {
  // Make a random recipient address.
  const receiver = Keypair.generate();

  // Get developer wallet address.
  const senderWalletAddress = await getWallet();
  const sender = new PublicKey(senderWalletAddress);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // As the sender would be sending the tokens to the receiver,
  // we need to fund the wallet with some SOL to pay for the transaction fees.
  await connection.confirmTransaction(
    await connection.requestAirdrop(sender, 2 * LAMPORTS_PER_SOL)
  );

  // Build and sign the transfer transaction.
  let tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: receiver.publicKey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  tx.feePayer = sender;

  let txnDataToBeSigned = tx.serializeMessage();
  let signedTransaction = await signTransaction(txnDataToBeSigned);

  // Populate the transaction with the signature from the API response
  // and send it to the network.
  const signature = Uint8Array.from(
    Buffer.from(signedTransaction.signature.slice(2), "hex")
  );

  tx.addSignature(sender, signature);

  // Verify the signature of the transaction from the API response.
  const signatureVerified = nacl.sign.detached.verify(
    txnDataToBeSigned,
    signature,
    bs58.decode(senderWalletAddress)
  );

  if (signatureVerified) {
    console.log("Transaction verified");
  } else {
    console.log("Transaction verification failed");
    exit(1);
  }

  // Send the transaction to the network.
  const txnHash = await connection.sendRawTransaction(tx.serialize());

  // Confirm the transaction.
  await connection.confirmTransaction(txnHash);

  console.log("Transaction Hash: ", txnHash);
  console.log(
    "Transaction confirmed. See on Solana Explorer:" +
      `https://explorer.solana.com/tx/${txnHash}?cluster=devnet`
  );
};

async function main() {
  checkApiKey();
  await transferTokens(1);
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
