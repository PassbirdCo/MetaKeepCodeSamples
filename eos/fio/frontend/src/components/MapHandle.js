import React, { useState } from "react";
import "./common.css";
import { message, Spin } from "antd";
import { FioWallet } from "fio-wallet";

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
    const wallet = new FioWallet(
      process.env.REACT_APP_FIO_DOMAIN,
      process.env.REACT_APP_FIO_BASE_URL,
      process.env.REACT_APP_APP_ID,
      email
    );
    const broadcastResponse = await wallet.mapHandle({
      publicAddress: publicAddress,
      chainCode: "ETH",
      tokenCode: "ETH",
    });
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
        className="email-input"
      />
      <input
        value={publicAddress}
        onChange={(e) => setPublicAddress(e.target.value)}
        placeholder="Enter your public address"
        className="email-input"
      />
      {isLoading ? (
        <Spin size="large" className="custom-spinner" />
      ) : (
        <button onClick={handleMapHandle} className="register-button">
          Register
        </button>
      )}
    </div>
  );
};

export default MapHandle;
