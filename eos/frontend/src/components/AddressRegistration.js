import React, { useState } from "react";
import "./common.css"; // Import CSS file
import { message } from "antd";
import { createRegisterAddressTx, broadcastTx } from "../utils/addressRegistration";
import { MetaKeep } from "metakeep";

const AddressRegistration = () => {

  // initiate Metakeep SDK

  const [email, setEmail] = useState("");
  const [sdk, setSdk] = useState(null);
  const [eosAddress, setEosAddress] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSdkInit = async (email) => {
    try {
      // Initialize the MetaKeep SDK
      const mkSdk = new MetaKeep({
        appId: "fd4be843-7769-41dc-bfd8-5d71af47241c",
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
      const eosAddress = wallet.wallet.eosAddress;
      // convert EOS address to FIO address
      console.log(eosAddress);
      const fioAddress = "FIO" + eosAddress.slice(3);
      console.log(fioAddress);
      const {serializedTransaction, serializedContextFreeData, rawTx, serializedActionData, chain_id} = await createRegisterAddressTx(
        fioAddress,
        "adityatutorial@fiotestnet",
        "fio.address",
        "regaddress",
      )
      console.log(serializedTransaction, serializedContextFreeData, rawTx, serializedActionData)
      
      // deep copy rawTx
      const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
      // sign transaction with MetaKeep
      rawTx.actions[0].data = serializedActionData;
      const response = await sdk.signTransaction({rawTransaction: rawTx, extraSigningData: {chainId: chain_id}}, "eos address registration");
      const signature = response.signature
      console.log(signature);
      // broadcast transaction to the blockchain
      const broadcastResponse = await broadcastTx(rawTxCopy, chain_id,"fio.address", signature);

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
