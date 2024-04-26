import React, { useState } from "react";
import { message, Input, Button, Space, Card, Form } from "antd";
import {
  createRawTx,
  broadcastTx,
  EOSPubKeyToFIOPubKey,
} from "../utils/fioTransactionUtils";
import { MetaKeep } from "metakeep";
const { Fio } = require("@fioprotocol/fiojs");

const TransferFIO = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = async ({ senderEmail, receiverEmail, amount }) => {
    try {
      setIsLoading(true);
      const senderSdk = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: { email: senderEmail },
      });

      const receiverSdk = new MetaKeep({
        appId: process.env.REACT_APP_APP_ID,
        user: { email: receiverEmail },
      });

      const [senderWallet, receiverWallet] = await Promise.all([
        senderSdk.getWallet(),
        receiverSdk.getWallet(),
      ]);

      const senderFioPubKey = EOSPubKeyToFIOPubKey(
        senderWallet.wallet.eosAddress
      );
      const receiverFioPubKey = EOSPubKeyToFIOPubKey(
        receiverWallet.wallet.eosAddress
      );

      const actionData = {
        payee_public_key: receiverFioPubKey,
        amount: amount * 1000000000,
        max_fee: 40000000000,
        tpid: "",
        actor: Fio.accountHash(senderFioPubKey),
      };

      const { rawTx, serializedActionData, chain_id } = await createRawTx(
        senderFioPubKey,
        actionData,
        "fio.token",
        "trnsfiopubky"
      );

      const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
      rawTx.actions[0].data = serializedActionData;

      const response = await senderSdk.signTransaction(
        { rawTransaction: rawTx, extraSigningData: { chainId: chain_id } },
        `transfer ${amount} FIO token from ${senderEmail} to ${receiverEmail}`
      );

      const signature = response.signature;

      const broadcastResponse = await broadcastTx(
        rawTxCopy,
        chain_id,
        "fio.address",
        signature
      );

      if (broadcastResponse.transaction_id) {
        message.success("Transfer successful!");
      } else {
        message.error("Transfer failed!");
      }
      console.log(broadcastResponse);
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Space direction="vertical" size={16} className="form-container">
      <Card title="Transfer FIO Tokens">
        <Form onFinish={handleTransfer} layout="vertical">
          <Form.Item
            name="senderEmail"
            label="Sender email"
            rules={[{ required: true, message: "Please enter sender's email" }]}
          >
            <Input className="input" placeholder="Enter sender's email" />
          </Form.Item>
          <Form.Item
            name="receiverEmail"
            label="Receiver email"
            rules={[
              { required: true, message: "Please enter receiver's email" },
            ]}
          >
            <Input className="input" placeholder="Enter receiver's email" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter the amount" }]}
          >
            <Input className="input" type="number" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Transfer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default TransferFIO;
