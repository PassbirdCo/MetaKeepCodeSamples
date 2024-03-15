const fetchMock = require("fetch-mock");
import { createRawTx, broadcastTx, EOSPubKeyToFIOPubKey } from "../src/utils";
import { Transactions } from "@fioprotocol/fiosdk/lib/transactions/Transactions";

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
    const account = "account";
    const action = "action";
    const mockChainInfo = {
      chain_id: "chainId",
      last_irreversible_block_num: 1234,
    };
    const mockBlockData = {
      block_num: 5678,
      ref_block_prefix: 1234567890,
    };

    fetchMock.postOnce("https://fiotestnet.blockpane.com/v1/chain/get_info", {
      body: mockChainInfo,
    });
    fetchMock.postOnce("https://fiotestnet.blockpane.com/v1/chain/get_block", {
      body: mockBlockData,
    });

    const mockGetRawAbiResponse = {
      account_name: "account",
      abi: "dGVzdA==",
    };

    fetchMock.post("https://fiotestnet.blockpane.com/v1/chain/get_raw_abi", {
      body: mockGetRawAbiResponse,
      status: 200,
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
    });

    // Assert
    expect(result.rawTx).toEqual(expectedRawTx);
    expect(result.serializedActionData).toEqual(expectedSerializedActionData);
    expect(result.chainId).toEqual(expectedChainId);
  });
});

describe("broadcastTx", () => {
  it("should broadcast a transaction", async () => {
    // Setup
    const rawTx = {
      test: "test",
    };
    const chainId = "chainId";
    const account = "account";
    const signature = "yourSignature";
    const expectedTransactionId = "yourExpectedTransactionId";

    const mockGetRawAbiResponse = {
      account_name: "account",
      abi: "dGVzdA==",
    };

    fetchMock.post("https://fiotestnet.blockpane.com/v1/chain/get_raw_abi", {
      body: mockGetRawAbiResponse,
      status: 200,
    });
    const mockFetchResponse = {
      transaction_id: expectedTransactionId,
      processed: {
        receipt: { status: "executed", cpu_usage_us: 100, net_usage_words: 10 },
      },
    };
    fetchMock.postOnce(
      "https://fiotestnet.blockpane.com/v1/chain/push_transaction",
      mockFetchResponse
    );

    // Run
    const result = await broadcastTx({ rawTx, chainId, account, signature });


    // Assert
    expect(result.transaction_id).toEqual(expectedTransactionId);

    expect(fetchMock.calls().length).toEqual(2);
    expect(fetchMock.lastCall()[0]).toEqual(
      "https://fiotestnet.blockpane.com/v1/chain/push_transaction"
    );
    expect(fetchMock.lastCall()[1]?.body).toEqual(
      JSON.stringify({
        signatures: [signature],
        packed_trx: Buffer.from("mockSerializedTransaction").toString("hex"),
        packed_context_free_data: Buffer.from(
          "mockSerializedContextFreeData"
        ).toString("hex"),
        compression: 0,
      })
    );
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

afterEach(() => {
  fetchMock.restore();
});
