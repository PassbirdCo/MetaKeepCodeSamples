import React, { useState } from "react";
import "./common.css";
import { message, Spin } from "antd";
import { createRawTx, broadcastTx } from "../utils/fioTransactionUtils";
import { MetaKeep } from "metakeep";
const { Fio } = require("@fioprotocol/fiojs");

const TransferFIO = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [sdk, setSdk] = useState(null);
  const [signInitiated, setSignInitiated] = useState(false);
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

  const handleSdkInit = async (email) => {
    try {
      setLoading(true);
      // Initialize the MetaKeep SDK
      const mkSdk = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: { email: email },
        environment: process.env.REACT_APP_ENVIRONMENT,
      });
      setSdk(mkSdk);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!senderEmail) {
      message.error("Please enter your email!");
      return;
    }

    setLoading(true);
    await handleSdkInit(senderEmail);
    setSignInitiated(true);
    setLoading(false);
  };

  const handleTransfer = async () => {
    if (!senderEmail) {
      message.error("Please enter your email!");
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
    const wallet = await sdk.getWallet();
    const fioAddress = "FIO" + wallet.wallet.eosAddress.slice(3);

    const sdkToUser = new MetaKeep({
      appId: process.env.REACT_APP_APP_ID,
      user: { email: receiverEmail },
      environment: process.env.REACT_APP_ENVIRONMENT,
    });

    const recieverAddress = await sdkToUser.getWallet();
    const recieverFioAddress =
      "FIO" + recieverAddress.wallet.eosAddress.slice(3);

    const actionData = {
      payee_public_key: recieverFioAddress,
      amount: amount,
      max_fee: 40000000000,
      tpid: "",
      actor: Fio.accountHash(fioAddress),
    };
    const { rawTx, serializedActionData, chain_id } = await createRawTx(
      fioAddress,
      actionData,
      "fio.token",
      "trnsfiopubky"
    );

    // Deep copy rawTx
    const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
    // Sign transaction with MetaKeep
    rawTx.actions[0].data = serializedActionData;
    const response = await sdk.signTransaction(
      { rawTransaction: rawTx, extraSigningData: { chainId: chain_id } },
      "eos token transfer"
    );

    // If user cancels signing, return
    if (!response) {
      setSignInitiated(false);
      setLoading(false);
      return;
    }
    if (response.error) {
      message.error(response.error.message);
      setLoading(false);
      return;
    }

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
      message.success("Transaction successful!");
    } else {
      message.error("Transaction failed!");
    }
    console.log(broadcastResponse);
    setSignInitiated(false);
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Transfer FIO token</h2>
      <input
        type="email"
        value={senderEmail}
        onChange={handleSenderEmailChange}
        placeholder="Enter your email"
        className="email-input"
        disabled={signInitiated || loading}
      />
      <input
        type="email"
        value={receiverEmail}
        onChange={handleReceiverEmailChange}
        placeholder="Enter receiver's email"
        className="email-input"
        disabled={signInitiated || loading}
      />
      <input
        type="number"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Enter amount"
        className="email-input"
        disabled={signInitiated || loading}
      />
      {loading ? (
        <Spin size="large" className="custom-spinner" />
      ) : signInitiated ? (
        <button onClick={handleTransfer} className="register-button">
          Confirm
        </button>
      ) : (
        <button onClick={handleLogin} className="register-button">
          Transfer
        </button>
      )}
    </div>
  );
};

export default TransferFIO;
