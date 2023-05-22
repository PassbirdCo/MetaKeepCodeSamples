import React, { useState } from "react";
import "./common.css"; // Import CSS file
import { message } from "antd";
import { createRegisterAddressTx, broadcastTx } from "../utils/addressRegistration";
import { MetaKeep } from "metakeep";
const { Fio } = require("@fioprotocol/fiojs");

const TransferFIO = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [sdk, setSdk] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

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
      // Initialize the MetaKeep SDK
      const mkSdk = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: {email: email},
        environment: "dev"
      });
      setSdk(mkSdk);
    } catch (error) {
      message.error(error.message);
  }
  };
  
  const handleLogin = async () => {
    if (!senderEmail) {
      message.error("Please enter your email!");
    }
    if (senderEmail) {
      await handleSdkInit(senderEmail);
      setLoggedIn(true);
    }
  };

  const handleTransfer =  async () => {
    if (!senderEmail) {
      message.error("Please enter your email!");
    }
    if (!receiverEmail) {
      message.error("Please enter receiver's email!");
    }
    if (!amount) {
      message.error("Please enter amount!");
    }
    if (senderEmail && receiverEmail && amount) {
      const wallet = await sdk.getWallet();
      const fioAddress = "FIO" + wallet.wallet.eosAddress.slice(3);

      const sdkToUser = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: {email: receiverEmail},
        environment: "dev"
      });

      const recieverAddress = await sdkToUser.getWallet();
      const recieverFioAddress = "FIO" + recieverAddress.wallet.eosAddress.slice(3);

      const actionData = {
        payee_public_key: recieverFioAddress,
        amount: amount,
        max_fee: 40000000000,
        tpid: "",
        actor: Fio.accountHash(fioAddress),
      }
      const {rawTx, serializedActionData, chain_id} = await createRegisterAddressTx(
        fioAddress,
        actionData,
        "fio.token",
        "trnsfiopubky",
      );
      
      // deep copy rawTx
      const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
      // sign transaction with MetaKeep
      rawTx.actions[0].data = serializedActionData;
      const response = await sdk.signTransaction({rawTransaction: rawTx, extraSigningData: {chainId: chain_id}}, "eos token transfer");
      // if user cancels signing, return
      if (!response) {
        setLoggedIn(false);
        return;
      }
      if (response.error) {
        message.error(response.error.message);
        return;
      }

      const signature = response.signature
      // broadcast transaction to the blockchain
      const broadcastResponse = await broadcastTx(rawTxCopy, chain_id,"fio.address", signature);
      // alert user if transaction is successful
      if (broadcastResponse.transaction_id) {
        message.success("Transaction successful!");
      }
      else {
        message.error("Transaction failed!");
      }
      console.log(broadcastResponse);
      setLoggedIn(false);
    }
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
        disabled={loggedIn}
      />
      <input
        type="email"
        value={receiverEmail}
        onChange={handleReceiverEmailChange}
        placeholder="Enter receiver's email"
        className="email-input"
        disabled={loggedIn}
      />
      <input
        type="number"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Enter amount"
        className="email-input"
        disabled={loggedIn}
      />
      {
        !loggedIn ? <button onClick={handleLogin} className="register-button">
        Login
      </button> : <button onClick={handleTransfer} className="register-button">
        Transfer
      </button>
      }
    </div>
  );
};

export default TransferFIO;
