import React, { useState } from "react";
import "./common.css";
import { message, Spin } from "antd";
import { createRawTx, broadcastTx } from "../utils/fioTransactionUtils";
import { MetaKeep } from "metakeep";
const { Fio } = require("@fioprotocol/fiojs");

const AddressRegistration = () => {
  const [email, setEmail] = useState("");
  const [sdk, setSdk] = useState(null);
  const [signInitiated, setSignInitiated] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSdkInit = async (email) => {
    try {
      // Initialize the MetaKeep SDK
      const mkSdk = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: { email: email },
        environment: process.env.REACT_APP_ENVIRONMENT,
      });
      setSdk(mkSdk);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleLogin = async () => {
    if (!email) {
      message.error("Please enter your email!");
      return;
    }
    await handleSdkInit(email);
    setSignInitiated(true);
  };

  const handleRegister = async () => {
    if (!email) {
      message.error("Please enter your email!");
      return;
    }
    setLoading(true); // Show the loader
    const wallet = await sdk.getWallet();
    const fioAddress = "FIO" + wallet.wallet.eosAddress.slice(3);

    const actionData = {
      // Slice Email before @
      fio_address: email.slice(0, email.indexOf("@")) + "@fiotestnet",
      owner_fio_public_key: fioAddress,
      max_fee: 40000000000,
      tpid: "rewards@wallet",
      actor: Fio.accountHash(fioAddress),
    };

    try {
      const { rawTx, serializedActionData, chain_id } = await createRawTx(
        fioAddress,
        actionData,
        "fio.address",
        "regaddress"
      );

      // Deep copy rawTx
      const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
      // Sign transaction with MetaKeep
      rawTx.actions[0].data = serializedActionData;
      const response = await sdk.signTransaction(
        { rawTransaction: rawTx, extraSigningData: { chainId: chain_id } },
        "eos address registration"
      );
      const signature = response.signature;
      // Broadcast transaction to the blockchain
      const broadcastResponse = await broadcastTx(
        rawTxCopy,
        chain_id,
        "fio.address",
        signature
      );

      if (broadcastResponse.transaction_id) {
        message.success("Transaction successful!");
      } else {
        message.error("Transaction failed!");
      }
      setSignInitiated(false);
      console.log(broadcastResponse);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false); // Hide the loader
    }
  };

  return (
    <div className="form-container">
      <h2>Address Registration</h2>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email"
        className="email-input"
        disabled={signInitiated}
      />
      {loading ? (
        // Show the loader if loading state is true
        <Spin size="large" style={{ color: "black" }} />
      ) : (
        <button
          onClick={signInitiated ? handleRegister : handleLogin}
          className="register-button"
        >
          {signInitiated ? "Confirm" : "Register"}
        </button>
      )}
    </div>
  );
};

export default AddressRegistration;
