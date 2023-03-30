// This tutorial focuses on use of Metakeep getWallet API and signTransaction API.

import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Message,
} from "@solana/web3.js";
import axios from "axios";
import bs58 from "bs58";
import nacl from "tweetnacl";
import env from "dotenv";

env.config();

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
    url: "https://api.metakeep.xyz/v3/getDeveloperWallet",
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
    url: "https://api.metakeep.xyz/v2/app/sign/transaction",
    headers: headers,
    data: {
      transaction_object: {
        serialized_transaction_message: transaction.toString("hex"),
      },
      chainId: "CHAIN_ID_SOLANA_TESTNET",
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

const makeTransaction = async (amount) => {
  const reciever = Keypair.generate();
  const senderWalletAddress = await getWallet();
  // Sender is the wallet that we get from the getWallet API.
  const sender = new PublicKey(senderWalletAddress);

  let tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: reciever.publicKey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

  // As the sender would be sending the tokens to the reciever, we need to fund the wallet with some SOL.
  await connection.confirmTransaction(
    await connection.requestAirdrop(sender, LAMPORTS_PER_SOL)
  );

  tx.feePayer = sender;

  let txnDataToBeSigned = tx.serializeMessage();

  let signedTransaction = await signTransaction(txnDataToBeSigned);

  // recover the signed transaction and send it to the network.
  const signature = Uint8Array.from(
    Buffer.from(signedTransaction.signature.slice(2), "hex")
  );

  let recoverTx = Transaction.populate(Message.from(txnDataToBeSigned), [
    bs58.encode(signature),
  ]);

  // verify the transaction.

  const is_signed_by_sender = nacl.sign.detached.verify(
    txnDataToBeSigned,
    signature,
    bs58.decode(senderWalletAddress)
  );

  if (is_signed_by_sender) {
    console.log("Transaction verified");
  }

  // send the transaction to the network.

  const txn = await connection.sendRawTransaction(recoverTx.serialize());

  // confirm the transaction.

  await connection.confirmTransaction(txn);

  console.log("Transaction Hash: ", txn);

  console.log("Transaction confirmed");
};

async function main() {
  checkApiKey();
  await makeTransaction(1);
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
