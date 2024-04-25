import React, { useState } from "react";
import { message, Input, Button, Space, Card, Form } from "antd";
import { FIOWallet } from "fio-wallet";

const MapHandle = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMapHandle = async ({ email, publicAddress, fioHandle }) => {
    try {
      setIsLoading(true);

      const wallet = new FIOWallet({
        appId: process.env.REACT_APP_APP_ID ?? "",
        user: {
          email,
        },
      });

      const broadcastResponse = await wallet.mapHandle(fioHandle, [
        {
          public_address: publicAddress,
          chain_code: "ETH",
          token_code: "ETH",
        },
      ]);

      console.log("Transaction broadcastResponse: ", broadcastResponse);

      if (broadcastResponse?.transaction_id) {
        message.success("Map successful!");
      } else {
        message.error("Map failed!");
      }
    } catch {
      message.error("Map failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Space direction="vertical" size={16} className="form-container">
      <Card title="Map handle">
        <Form
          name="map_handle_form"
          onFinish={handleMapHandle}
          initialValues={{ email: "", publicAddress: "", fioHandle: "" }}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" className="input" />
          </Form.Item>
          <Form.Item
            name="fioHandle"
            label="FIO handle"
            rules={[
              { required: true, message: "Please enter your FIO handle" },
            ]}
          >
            <Input placeholder="Enter your FIO handle" className="input" />
          </Form.Item>
          <Form.Item
            name="publicAddress"
            label="Public ETH address"
            rules={[
              {
                required: true,
                message: "Please enter your public ETH address",
              },
            ]}
          >
            <Input
              placeholder="Enter your public ETH address"
              className="input"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Map
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default MapHandle;
