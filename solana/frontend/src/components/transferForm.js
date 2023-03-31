// Form to login and send tokens on Solana Chain.

import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import "./transferFrom.css";
import {
  getTransferTokenTransaction,
  sendTransactionOnChain,
  requestAirdrop,
} from "../utils/transferTokenUtils";
import { MetaKeep } from "metakeep";

export const TransferForm = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userSolanaAddress, setUserSolanaAddress] = useState("");
  const [sdk, setSdk] = useState(null);
  const [txnHash, setTxnHash] = useState("");

  const login = async (email) => {
    try {
      // Initialize the MetaKeep SDK
      const mkSdk = new MetaKeep({
        environment: process.env.REACT_APP_SDK_ENV,
        appId: process.env.REACT_APP_APP_ID,
        user: { email },
      });
      setSdk(mkSdk);

      const response = await mkSdk.getWallet();
      console.log(response);
      setUserEmail(email);
      setUserSolanaAddress(response.wallet.solAddress);
      setIsUserLoggedIn(true);
      message.success("Login successful!");
    } catch (error) {
      console.log(error);
      message.error("Login failed!");
    }
  };

  const transferTokens = async (toEmail, amount) => {
    // As the sender would be sending the tokens to the receiver,
    // we need to fund the wallet with some SOL to pay for the transaction fees.
    await requestAirdrop(userSolanaAddress, 2);

    try {
      // Get the recipient's wallet
      // We will create a new instance of MetaKeep for the recipient
      // to get the recipient's wallet address silently.
      const sdkToUser = new MetaKeep({
        environment: process.env.REACT_APP_SDK_ENV,
        appId: process.env.REACT_APP_APP_ID,
        user: { email: toEmail },
      });

      var toEmailWallet = await sdkToUser.getWallet();
    } catch (error) {
      console.log(error);
      alert("Recipient Wallet couldn't be fetched!");
      return;
    }

    const toAddress = toEmailWallet.wallet.solAddress;
    const serializedTransaction = await getTransferTokenTransaction(
      userSolanaAddress,
      toAddress,
      amount
    );
    try {
      const transactionObject = {
        serializedTransactionMessage: serializedTransaction.toString("hex"),
      };
      const response = await sdk.signTransaction(
        transactionObject,
        `transfer ${amount} SOL to ${toEmail}`
      );
      console.log(response);
      const transactionHash = await sendTransactionOnChain(
        response.signature,
        serializedTransaction
      );

      message.success(
        "Transaction confirmed. See on Solana Explorer:" +
          `https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`
      );

      setTxnHash(transactionHash);
    } catch (error) {
      console.log(error);
      message.error("Transfer failed!");
      throw error;
    }
  };

  const onLogin = async (values) => {
    const { email } = values;
    await login(email);
  };

  const onLoginFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Login failed!");
  };

  const onFinish = async (values) => {
    console.log("Success:", values);
    const { to, amount } = values;
    await transferTokens(to, amount);
    message.success("Transfer successful!");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Transfer failed!");
  };

  return !isUserLoggedIn ? (
    <div className="form-container">
      <Form
        name="login"
        onFinish={onLogin}
        onFinishFailed={onLoginFailed}
        layout="vertical"
      >
        <Form.Item
          label="Enter your email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <>
      <div className="form-container">
        <h3>Logged in as {userEmail}</h3>
        <h3>Your Solana Address is {userSolanaAddress}</h3>
        <h3>Enter recipient details below </h3>
        <Form
          name="transfer"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Recipient Email"
            name="to"
            rules={[
              {
                required: true,
                message: "Please input the recipient email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Amount to transfer"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input the amount!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
      {txnHash && (
        <h3>
          Transaction Confirmed. See on Solana Explorer:{" "}
          <a href={`https://explorer.solana.com/tx/${txnHash}?cluster=devnet`}>
            https://explorer.solana.com/tx/{txnHash}?cluster=devnet
          </a>
        </h3>
      )}
    </>
  );
};
