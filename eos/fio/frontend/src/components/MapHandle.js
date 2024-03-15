import React, { useState } from "react";
import "./common.css";
import { message } from "antd";
const { FIOWallet } = require("fio-wallet");

const MapHandle = () => {
  const [email, setEmail] = useState("");
  const [publicAddress, setPublicAddress] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMapHandle = async () => {
    if (!email) {
      message.error("Please enter your email!");
      return;
    }

    if (!publicAddress) {
      message.error("Please enter your public address!");
      return;
    }

    const wallet = new FIOWallet(appId, email);
    wallet.mapHandle({
      publicAddress: publicAddress,
      chainCode: "ETH",
      tokenCode: "ETH",
    });
  };

  return (
    <div className="form-container">
      <h2>Map handle</h2>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email"
        className="email-input"
      />
      <input
        value={publicAddress}
        onChange={(e) => setPublicAddress(e.target.value)}
        placeholder="Enter your public address"
        className="email-input"
      />

      <button onClick={handleMapHandle} className="register-button">
        {"Register"}
      </button>
    </div>
  );
};

export default MapHandle;
