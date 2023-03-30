// Form to login and send tokens on Solana Chain.

import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import "./transferFrom.css";
import {
  getTransferTokenTransaction,
  sendTransactionOnChain,
} from "../utils/transferTokenUtils";
import { MetaKeep } from "metakeep";

export const TransferForm = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [userSolanaAddress, setUserSolanaAddress] = useState("");

  const sdk = new MetaKeep({
    environment: "dev",
    appId: "ec68d40b-b910-4d20-9d4b-dfe6c2391fb3",
  });

  const login = async (email) => {
    try {
      const response = await sdk.getWallet();
      console.log(response);
      setEmail(email);
      setUserSolanaAddress(response.wallet.solAddress);
      setIsUserLoggedIn(true);
      message.success("Login successful!");
    } catch (error) {
      console.log(error);
      alert("Login failed!");
    }
  };

  const transferTokens = async (to, amount) => {
    const serializedTransaction = await getTransferTokenTransaction(
      userSolanaAddress,
      to,
      amount
    );
    try {
      const transactionObject = {
        serialized_transaction_message: serializedTransaction.toString("hex"),
      };
      const response = await sdk.signTransaction(
        transactionObject,
        "token transfer"
      );
      console.log(response);
      const transactionHash = await sendTransactionOnChain(
        response.signature,
        serializedTransaction
      );
      alert(transactionHash);
      message.success("Transfer successful!");
    } catch (error) {
      console.log(error);
      alert("Transfer failed!");
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
          label="Email"
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
    <div className="form-container">
      <Form
        name="transfer"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="To"
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
          label="Amount"
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
  );
};
