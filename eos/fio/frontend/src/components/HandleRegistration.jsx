import React, { useState } from "react";
import "./common.css";
import { message, Button, Input, Card, Space, Flex, Form } from "antd";
import {
  EOSPubKeyToFIOPubKey,
  buyFIOHandle,
} from "../utils/fioTransactionUtils";
import { MetaKeep } from "metakeep";

const HandleRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [FIOPubKey, setFIOPubKey] = useState("unknown");
  const [publicETHAddress, setPublicETHAddress] = useState("unknown");
  const [buyHandleResponse, setBuyHandleResponse] = useState(null);

  const handleRegister = async ({ email, fioHandle }) => {
    // Show the loader
    setIsLoading(true);

    try {
      // Initialize the MetaKeep SDK
      const sdk = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: { email },
      });
      const wallet = await sdk.getWallet();
      setPublicETHAddress(wallet.wallet.ethAddress);

      const fioPubKey = EOSPubKeyToFIOPubKey(wallet.wallet.eosAddress);

      setFIOPubKey(fioPubKey);

      const buyHandleResponse = await buyFIOHandle({ fioHandle, fioPubKey });

      if (!buyHandleResponse.ok) {
        message.error("An error occurred while buying the FIO handle");
      } else {
        message.success("FIO handle registered successfully");
      }

      setBuyHandleResponse(JSON.stringify(await buyHandleResponse.json()));
    } catch (error) {
      message.error(error.status ?? error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Space direction="vertical" size={16} className="form-container">
      <Card title="FIO handle registration">
        <Flex gap="middle" vertical>
          <Form name="address_form" onFinish={handleRegister} layout="vertical">
            <Form.Item
              name="email"
              label="Enter your email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input className="input" type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="fioHandle"
              label="Enter the handle you want to buy (e.g. john-awesome@wallet)"
              rules={[
                { required: true, message: "Please enter your FIO handle" },
              ]}
            >
              <Input className="input" placeholder="FIO handle" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Card>
      <span>Your Public FIO Key: {FIOPubKey}</span>
      <span>Your Public ETH Address: {publicETHAddress}</span>
      {buyHandleResponse && <span>Response: {buyHandleResponse}</span>}
    </Space>
  );
};

export default HandleRegistration;
