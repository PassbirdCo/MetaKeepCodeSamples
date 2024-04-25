import React, { useState } from "react";
import "./common.css";
import { message, Button, Input, Card, Space, Flex, Form } from "antd";
import {
  EOSPubKeyToFIOPubKey,
  buyFIOAddress,
} from "../utils/fioTransactionUtils";
import { MetaKeep } from "metakeep";

const AddressRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [FIOPubKey, setFIOPubKey] = useState("unknown");
  const [publicETHAddress, setPublicETHAddress] = useState("unknown");
  const [buyAddressResponse, setBuyAddressResponse] = useState(null);

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

      const buyAddressResponse = await buyFIOAddress({ fioHandle, fioPubKey });
      if (!buyAddressResponse.ok) {
        message("An error occuurred");
      }
      setBuyAddressResponse(JSON.stringify(await buyAddressResponse.json()));
    } catch (error) {
      message.error(error.status ?? error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Space direction="vertical" size={16} className="form-container">
      <Card title="FIO address registration">
        <Flex gap="middle" vertical>
          <Form name="address_form" onFinish={handleRegister} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input className="input" type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="fioHandle"
              label="FIO handle"
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
      <span>Your FIO Public Key: {FIOPubKey}</span>
      <span>Your Public ETH Address: {publicETHAddress}</span>
      {buyAddressResponse && <span>Response: {buyAddressResponse}</span>}
    </Space>
  );
};

export default AddressRegistration;
