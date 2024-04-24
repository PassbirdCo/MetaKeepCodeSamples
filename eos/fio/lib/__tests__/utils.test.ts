import { Transactions } from "@fioprotocol/fiosdk/lib/transactions/Transactions";

import { createRawTx, broadcastTx, EOSPubKeyToFIOPubKey } from "../src/utils";

jest.mock("@fioprotocol/fiojs", () => ({
  Fio: {
    accountHash: jest.fn(),
  },
  serializeActionData: jest.fn(),
  Api: jest.fn(),
}));

jest.mock("@fioprotocol/fiojs/dist/chain-api", () => ({
  Api: jest.fn().mockImplementation(() => ({
    getContract: jest.fn().mockResolvedValue("mockContract"),
  })),
}));

jest.mock("@fioprotocol/fiosdk/lib/transactions/Transactions", () => ({
  Transactions: jest.fn().mockImplementation(() => ({
    createRawTransaction: jest.fn().mockResolvedValue("mockRawTx"),
    serialize: jest.fn().mockResolvedValue({
      serializedContextFreeData: "mockSerializedContextFreeData",
      serializedTransaction: "mockSerializedTransaction",
    }),
  })),
}));

Transactions.abiMap = new Map();

jest.mock("@fioprotocol/fiojs/dist/chain-serialize", () => ({
  serializeActionData: jest.fn().mockReturnValue("mockSerializedActionData"),
}));

const mockAbiMap = new Map();
mockAbiMap.set("account", { account_name: "account", abi: "dGVzdA==" });

describe("createRawTx", () => {
  it("should create a raw transaction", async () => {
    // Setup
    const publicKey = "yourPublicKey";
    const actionData = {
      fio_address: "testAddress",
      public_addresses: [
        {
          chain_code: "ETH",
          token_code: "ETH",
          public_address: "publicAddress",
        },
      ],
      max_fee: 10000000000000,
      tpid: "",
      actor: "actor",
    };
    const account = "fio.address";
    const action = "action";
    const mockChainInfo = {
      chain_id: "chainId",
      last_irreversible_block_num: 1234,
    };
    const mockBlockData = {
      block_num: 5678,
      ref_block_prefix: 1234567890,
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockChainInfo),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockBlockData),
        ok: true,
      });
    const expectedRawTx = "mockRawTx";
    const expectedSerializedActionData = "mockSerializedActionData";
    const expectedChainId = "chainId";

    // Run
    const result = await createRawTx({
      publicKey,
      actionData,
      account,
      action,
      fioBaseUrl: "https://fiotestnet.blockpane.com/v1",
    });

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      "https://fiotestnet.blockpane.com/v1/chain/get_info",
      { method: "POST" }
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://fiotestnet.blockpane.com/v1/chain/get_block",
      { body: JSON.stringify({ block_num_or_id: 1234 }), method: "POST" }
    );
    expect(result.rawTx).toEqual(expectedRawTx);
    expect(result.serializedActionData).toEqual(expectedSerializedActionData);
    expect(result.chainId).toEqual(expectedChainId);
    jest.clearAllMocks();
  });
});

describe("broadcastTx", () => {
  it("should broadcast a transaction", async () => {
    // Setup
    const rawTx = {
      test: "test",
    };
    const chainId = "chainId";
    const account = "fio.address";
    const signature = "mockSignature";
    const expectedTransactionId = "mockTransactionId";

    const mockPushTransactionResponse = {
      transaction_id: "mockTransactionId",
      abi: "dGVzdA==",
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(mockPushTransactionResponse),
      ok: true,
    });

    // Run
    const result = await broadcastTx({
      rawTx,
      chainId,
      account,
      signature,
      fioBaseUrl: "https://fiotestnet.blockpane.com/v1",
    });

    // Assert
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://fiotestnet.blockpane.com/v1/chain/push_transaction",
      {
        body: JSON.stringify({
          signatures: [signature],
          packed_trx: Buffer.from("mockSerializedTransaction").toString("hex"),
          packed_context_free_data: Buffer.from(
            "mockSerializedContextFreeData"
          ).toString("hex"),
          compression: 0,
        }),
        method: "POST",
      }
    );
    expect(result.transaction_id).toEqual(expectedTransactionId);
  });
});

describe("EOSPubKeyToFIOPubKey", () => {
  it("should convert an EOS public key to a FIO public key", () => {
    // Setup
    const eosPubKey = "yourEOSPublicKey";
    const expectedFIOPubKey = "FIOrEOSPublicKey";

    // Run
    const result = EOSPubKeyToFIOPubKey(eosPubKey);

    // Assert
    expect(result).toEqual(expectedFIOPubKey);
  });
});
