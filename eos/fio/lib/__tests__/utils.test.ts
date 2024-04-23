import axios from "axios";
import { Transactions } from "@fioprotocol/fiosdk/lib/transactions/Transactions";

import { createRawTx, broadcastTx, EOSPubKeyToFIOPubKey } from "../src/utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

    const mockedPost = mockedAxios.post
      .mockReturnValueOnce(Promise.resolve({ data: mockChainInfo }))
      .mockReturnValueOnce(Promise.resolve({ data: mockBlockData }));
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
    expect(mockedPost).toHaveBeenCalledWith(
      "https://fiotestnet.blockpane.com/v1/chain/get_info"
    );
    expect(mockedPost).toHaveBeenCalledWith(
      "https://fiotestnet.blockpane.com/v1/chain/get_block",
      { block_num_or_id: 1234 }
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

    const mockedPost = mockedAxios.post.mockReturnValueOnce(
      Promise.resolve({ data: mockPushTransactionResponse })
    );

    // Run
    const result = await broadcastTx({
      rawTx,
      chainId,
      account,
      signature,
      fioBaseUrl: "https://fiotestnet.blockpane.com/v1",
    });

    // Assert
    expect(mockedPost).toHaveBeenCalledWith(
      "https://fiotestnet.blockpane.com/v1/chain/push_transaction",
      {
        compression: 0,
        packed_context_free_data:
          "6d6f636b53657269616c697a6564436f6e746578744672656544617461",
        packed_trx: "6d6f636b53657269616c697a65645472616e73616374696f6e",
        signatures: ["mockSignature"],
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
