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

const AddressRegistration = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fioPubKey, setFioPubKey] = useState("unknown");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRegister = async () => {
    if (!email) {
      message.error("Please enter your email!");
      return;
    }

    // Show the loader
    setLoading(true);

    try {
      // Initialize the MetaKeep SDK
      const sdk = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: { email: email },
      });

      const wallet = await sdk.getWallet();

      const fioPubKey = EOSPubKeyToFIOPubKey(wallet.wallet.eosAddress);
      setFioPubKey(fioPubKey);

      // We will try to register the email as a FIO address.
      // Replace all non-alphanumeric characters with empty string.
      const fioAddress = email.replace(/[^a-zA-Z0-9]/g, "") + "@fiotestnet";

      const actionData = {
        fio_address: fioAddress,
        owner_fio_public_key: fioPubKey,
        max_fee: 40000000000,
        tpid: "",
        actor: Fio.accountHash(fioPubKey),
      };

      const { rawTx, serializedActionData, chain_id } = await createRawTx(
        fioPubKey,
        actionData,
        "fio.address",
        "regaddress"
      );

      // Create a copy of the raw transaction to update action data
      // with serialized action data.
      const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
      rawTx.actions[0].data = serializedActionData;

      // Sign transaction with MetaKeep
      const response = await sdk.signTransaction(
        { rawTransaction: rawTx, extraSigningData: { chainId: chain_id } },
        `register FIO Address "${fioAddress}"`
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
        message.success("Registration successful!");
      } else {
        message.error("Registration failed!");
      }
      console.log("Transaction broadcastResponse: ", broadcastResponse);
    } catch (error) {
      message.error(error.status ?? error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>FIO Address Registration</h2>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email"
        className="email-input"
      />
      {<h3>Your FIO Public Key: {fioPubKey}</h3>}
      {loading ? (
        <Spin size="large" className="custom-spinner" />
      ) : (
        <button onClick={handleRegister} className="register-button">
          {"Register"}
        </button>
      )}
    </div>
  );
};

export default AddressRegistration;
