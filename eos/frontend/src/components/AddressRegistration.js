import React, { useState } from "react";
import "./common.css"; // Import CSS file
import { message } from "antd";
import { createRegisterAddressTx, broadcastTx } from "../utils/addressRegistration";
import { MetaKeep } from "metakeep";
const { Fio } = require("@fioprotocol/fiojs");

const AddressRegistration = () => {

  // initiate Metakeep SDK

  const [email, setEmail] = useState("");
  const [sdk, setSdk] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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
    if (!email) {
      message.error("Please enter your email!");
    }
    if (email) {
      await handleSdkInit(email);
      setLoggedIn(true);
    }
  };

  const handleRegister = async () => {
    if (!email) {
      message.error("Please enter your email!");
    }
    if (email) {
      const wallet = await sdk.getWallet();
      const fioAddress = "FIO" + wallet.wallet.eosAddress.slice(3);

      const actionData = {
        // slice Email before @
        fio_address: email.slice(0, email.indexOf("@")) + "@fiotestnet",
        owner_fio_public_key: fioAddress,
        max_fee: 40000000000,
        tpid: 'rewards@wallet',
        actor: Fio.accountHash(fioAddress),
    };
      const {rawTx, serializedActionData, chain_id} = await createRegisterAddressTx(
        fioAddress,
        actionData,
        "fio.address",
        "regaddress",
      )
      
      // deep copy rawTx
      const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
      // sign transaction with MetaKeep
      rawTx.actions[0].data = serializedActionData;
      const response = await sdk.signTransaction({rawTransaction: rawTx, extraSigningData: {chainId: chain_id}}, "eos address registration");
      const signature = response.signature
      // broadcast transaction to the blockchain
      const broadcastResponse = await broadcastTx(rawTxCopy, chain_id,"fio.address", signature);
      if (broadcastResponse.transaction_id) {
        message.success("Transaction successful!");
      }
      else {
        message.error("Transaction failed!");
      }
      setLoggedIn(false);
      console.log(broadcastResponse);
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
        disabled={loggedIn}
      />
      {loggedIn ? <button onClick={handleRegister} className="register-button">
        Register
      </button>: <button onClick={handleLogin} className="register-button">
        Login
      </button>}
    </div>
  );
};

export default AddressRegistration;
