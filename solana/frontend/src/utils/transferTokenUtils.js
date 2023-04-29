const {
  clusterApiUrl,
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Message,
} = require("@solana/web3.js");
const bs58 = require("bs58");

const requestAirdrop = async (solanaAddress, amount) => {
  const connection = new Connection("clusterApiUrl("devnet"), "confirmed");
  await connection.confirmTransaction(
    await connection.requestAirdrop(
      new PublicKey(solanaAddress),
      amount * LAMPORTS_PER_SOL
    )
  );
};

/*
 * This function is used to get the serialized transaction message
 * @param {string} from - The public key of the sender
 * @param {string} to - The public key of the receiver
 * @param {number} amount - The amount of tokens to be transferred
 * @returns {buffer} - The serialized transaction message as a buffer
 */
const getTransferTokenTransaction = async (from, to, amount) => {
  // The connection to the devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const fromPublicKey = new PublicKey(from);

  const toPublicKey = new PublicKey(to);

  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromPublicKey,
      toPubkey: toPublicKey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  transferTransaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;

  transferTransaction.feePayer = fromPublicKey;

  return transferTransaction;
};

/*
 * This function is used to send the transaction on the chain
 * @param {string} signature - The signature of the transaction
 * @param {buffer} serialized_transaction_message - The serialized transaction message as a buffer
 * @returns {string} - The transaction hash
 */
const sendTransactionOnChain = async (
  signature,
  serialized_transaction_message
) => {
  // The connection to the devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const bufferSignature = Uint8Array.from(
    Buffer.from(signature.slice(2), "hex")
  );

  let transaction = Transaction.populate(
    Message.from(serialized_transaction_message),
    [bs58.encode(bufferSignature)]
  );

  const transactionHash = await connection.sendRawTransaction(
    transaction.serialize()
  );
  console.log("Transaction Hash :", transactionHash);
  console.log(
    "Transaction confirmed. See on Solana Explorer:" +
      `https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`
  );

  return transactionHash;
};

module.exports = {
  getTransferTokenTransaction,
  sendTransactionOnChain,
  requestAirdrop,
};
