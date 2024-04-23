import React, { useState } from "react";
import "./common.css";
import { message, Spin } from "antd";
import { FIOWallet } from "../dist/src";

const MapHandle = () => {
  const [email, setEmail] = useState("");
  const [publicAddress, setPublicAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
   
  const handleMapHandle = async () => {
    if (!email) {
      message.error("Please enter your email!");
      return;
    }

    if (!publicAddress) {
      message.error("Please enter your public address!");
      return;
    }

    setIsLoading(true);
    const wallet = new FIOWallet(
      process.env.REACT_APP_APP_ID ?? "",
      {
        email,
      },
      "DEVELOPMENT"
    );

    // We will try to register the email as a FIO address.
    // Replace all non-alphanumeric characters with empty string.
    const fioHandle = `${email.replace(/[^a-zA-Z0-9]/g, "")}@${
      process.env.REACT_APP_FIO_DOMAIN
    }`;
    const broadcastResponse = await wallet.mapHandle(fioHandle, [
      { public_address: publicAddress, chain_code: "ETH", token_code: "ETH" },
    ]);
    console.log("Transaction broadcastResponse: ", broadcastResponse);

    if (broadcastResponse?.transaction_id) {
      message.success("Map successful!");
    } else {
      message.error("Map failed!");
    }

    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Map handle</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="input"
      />
      <input
        value={publicAddress}
        onChange={(e) => setPublicAddress(e.target.value)}
        placeholder="Enter your public ETH address"
        className="input"
      />
      {isLoading ? (
        <Spin size="large" className="custom_spinner" />
      ) : (
        <button onClick={handleMapHandle} className="action_button">
          Map
        </button>
      )}
    </div>
  );
};

export default MapHandle;
