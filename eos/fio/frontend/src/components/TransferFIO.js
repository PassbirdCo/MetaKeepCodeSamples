import React, { useState } from "react";
import "./common.css";
import { message, Spin } from "antd";
import {
  createRawTx,
  broadcastTx,
  EOSPubKeyToFIOPubKey,
} from "../utils/fioTransactionUtils";
import { MetaKeep } from "metakeep";
const { Fio } = require("@fioprotocol/fiojs");

const TransferFIO = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [senderFioPubKey, setSenderFioPubKey] = useState("unknown");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverFioPubKey, setReceiverFioPubKey] = useState("unknown");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSenderEmailChange = (e) => {
    setSenderEmail(e.target.value);
  };

  const handleReceiverEmailChange = (e) => {
    setReceiverEmail(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTransfer = async () => {
    if (!senderEmail) {
      message.error("Please enter sender's email!");
      return;
    }
    if (!receiverEmail) {
      message.error("Please enter receiver's email!");
      return;
    }
    if (!amount) {
      message.error("Please enter amount!");
      return;
    }

    setLoading(true);

    try {
      // Initialize the sender MetaKeep SDK
      const senderSdk = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: { email: senderEmail },
      });

      // Initialize the receiver MetaKeep SDK
      const receiverSdk = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: { email: receiverEmail },
      });

      const [senderWallet, receiverWallet] = await Promise.all([
        senderSdk.getWallet(),
        receiverSdk.getWallet(),
      ]);

      const senderFioPubKey = EOSPubKeyToFIOPubKey(
        senderWallet.wallet.eosAddress
      );
      setSenderFioPubKey(senderFioPubKey);

      const receiverFioPubKey = EOSPubKeyToFIOPubKey(
        receiverWallet.wallet.eosAddress
      );
      setReceiverFioPubKey(receiverFioPubKey);

      const actionData = {
        payee_public_key: receiverFioPubKey,
        amount: amount * 1000000000, // 1 FIO = 1000000000 SUFs
        max_fee: 40000000000,
        tpid: "",
        actor: Fio.accountHash(senderFioPubKey),
      };
      const { rawTx, serializedActionData, chain_id } = await createRawTx(
        senderFioPubKey,
        actionData,
        "fio.token",
        "trnsfiopubky"
      );

      // Create a copy of the raw transaction to update action data
      // with serialized action data.
      const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
      rawTx.actions[0].data = serializedActionData;

      // Sign transaction with MetaKeep
      const response = await senderSdk.signTransaction(
        { rawTransaction: rawTx, extraSigningData: { chainId: chain_id } },
        `transfer ${amount} FIO token from ${senderEmail} to ${receiverEmail}`
      );

      const signature = response.signature;

      // Broadcast transaction to the blockchain
      const broadcastResponse = await broadcastTx(
        rawTxCopy,
        chain_id,
        "fio.address",
        signature
      );

      // Alert user if transaction is successful
      if (broadcastResponse.transaction_id) {
        message.success("Transfer successful!");
      } else {
        message.error("Transfer failed!");
      }
      console.log(broadcastResponse);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Transfer FIO token</h2>
      <input
        type="email"
        value={senderEmail}
        onChange={handleSenderEmailChange}
        placeholder="Enter sender's email"
        className="email-input"
        disabled={loading}
      />
      <h3> Sender FIO public key: {senderFioPubKey}</h3>
      <input
        type="email"
        value={receiverEmail}
        onChange={handleReceiverEmailChange}
        placeholder="Enter receiver's email"
        className="email-input"
        disabled={loading}
      />
      <h3> Receiver FIO public key: {receiverFioPubKey}</h3>
      <input
        type="number"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Enter amount"
        className="email-input"
        disabled={loading}
      />
      {loading ? (
        <Spin size="large" className="custom-spinner" />
      ) : (
        <button onClick={handleTransfer} className="register-button">
          Transfer
        </button>
      )}
    </div>
  );
};

export default TransferFIO;
