import { FIOWallet } from "../src/FIOWallet";
import { Environment } from "../src/utils";

jest.mock("metakeep", () => ({
  MetaKeep: jest.fn().mockImplementation(() => ({
    getWallet: jest
      .fn()
      .mockResolvedValue({ wallet: { eosAddress: "EOS12345" } }),
    signTransaction: jest
      .fn()
      .mockResolvedValue({ signature: "mockSignature" }),
  })),
}));

jest.mock("../src/utils", () => {
  const originalModule = jest.requireActual("../src/utils");

  return {
    ...originalModule,
    EOSPubKeyToFIOPubKey: jest.fn().mockReturnValue("FIO12345"),
    createRawTx: jest.fn().mockResolvedValue({
      rawTx: { actions: [{ data: "mockData" }] },
      serializedActionData: "mockSerializedData",
      chainId: "mockChainId",
    }),
    broadcastTx: jest
      .fn()
      .mockResolvedValue({ transaction_id: "mockTransactionId" }),
  };
});

jest.mock("@fioprotocol/fiojs", () => ({
  Fio: {
    accountHash: jest.fn().mockReturnValue("FIO12345"),
  },
}));

describe("FIOWallet", () => {
  describe("mapHandle", () => {
    it("should map a public address to a FIO handle", async () => {
      const wallet = new FIOWallet({
        appId: "mockAppId",
        user: {
          email: "mohit@metakeep.xyz",
        },
      });
      await wallet.mapHandle("mohitmetakeep@regtest", [
        {
          public_address: "mockPublicAddress",
          chain_code: "mockChainCode",
          token_code: "mockTokenCode",
        },
      ]);

      expect(wallet["sdk"]).toBeDefined();

      expect(require("../src/utils").createRawTx).toHaveBeenCalledWith({
        publicKey: "FIO12345",
        actionData: {
          fio_address: "mohitmetakeep@regtest",
          public_addresses: [
            {
              chain_code: "mockChainCode",
              token_code: "mockTokenCode",
              public_address: "mockPublicAddress",
            },
          ],
          max_fee: 10000000000000,
          tpid: "",
          actor: "FIO12345",
        },
        account: "fio.address",
        action: "addaddress",
        fioBaseUrl: "https://fio.blockpane.com/v1",
      });

      expect(wallet["sdk"]["signTransaction"]).toHaveBeenCalledWith(
        {
          rawTransaction: { actions: [{ data: "mockSerializedData" }] },
          extraSigningData: { chainId: "mockChainId" },
        },
        `map your FIO handle "mohitmetakeep@regtest" to 1 public address(es).`
      );

      expect(require("../src/utils").broadcastTx).toHaveBeenCalledWith({
        rawTx: { actions: [{ data: "mockData" }] },
        chainId: "mockChainId",
        account: "fio.address",
        signature: "mockSignature",
        fioBaseUrl: "https://fio.blockpane.com/v1",
      });
    });

    it("should show custom reason string to map a public address to a FIO handle", async () => {
      const wallet = new FIOWallet({
        appId: "mockAppId",
        user: {
          email: "mohit@metakeep.xyz",
        },
      });
      await wallet.mapHandle(
        "mohitmetakeep@regtest",
        [
          {
            public_address: "mockPublicAddress",
            chain_code: "mockChainCode",
            token_code: "mockTokenCode",
          },
        ],
        "Custom reason string"
      );

      expect(wallet["sdk"]["signTransaction"]).toHaveBeenCalledWith(
        {
          rawTransaction: { actions: [{ data: "mockSerializedData" }] },
          extraSigningData: { chainId: "mockChainId" },
        },
        "Custom reason string"
      );

      expect(require("../src/utils").broadcastTx).toHaveBeenCalledWith({
        rawTx: { actions: [{ data: "mockData" }] },
        chainId: "mockChainId",
        account: "fio.address",
        signature: "mockSignature",
        fioBaseUrl: "https://fio.blockpane.com/v1",
      });
    });

    it("should use development base url if env set to DEVELOPMENT", async () => {
      const wallet = new FIOWallet({
        appId: "mockAppId",
        user: {
          email: "mohit@metakeep.xyz",
        },
        env: Environment.DEVELOPMENT,
      });
      await wallet.mapHandle("mohitmetakeep@regtest", [
        {
          public_address: "mockPublicAddress",
          chain_code: "mockChainCode",
          token_code: "mockTokenCode",
        },
      ]);

      expect(wallet["sdk"]).toBeDefined();

      expect(require("../src/utils").createRawTx).toHaveBeenCalledWith({
        publicKey: "FIO12345",
        actionData: {
          fio_address: "mohitmetakeep@regtest",
          public_addresses: [
            {
              chain_code: "mockChainCode",
              token_code: "mockTokenCode",
              public_address: "mockPublicAddress",
            },
          ],
          max_fee: 10000000000000,
          tpid: "",
          actor: "FIO12345",
        },
        account: "fio.address",
        action: "addaddress",
        fioBaseUrl: "https://fiotestnet.blockpane.com/v1",
      });

      expect(wallet["sdk"]["signTransaction"]).toHaveBeenCalledWith(
        {
          rawTransaction: { actions: [{ data: "mockSerializedData" }] },
          extraSigningData: { chainId: "mockChainId" },
        },
        `map your FIO handle "mohitmetakeep@regtest" to 1 public address(es).`
      );

      expect(require("../src/utils").broadcastTx).toHaveBeenCalledWith({
        rawTx: { actions: [{ data: "mockSerializedData" }] },
        chainId: "mockChainId",
        account: "fio.address",
        signature: "mockSignature",
        fioBaseUrl: "https://fiotestnet.blockpane.com/v1",
      });
    });

    it("should throw error if more than 5 addresses are provided", async () => {
      const wallet = new FIOWallet({
        appId: "mockAppId",
        user: {
          email: "mohit@metakeep.xyz",
        },
      });
      expect(
        wallet.mapHandle("mohitmetakeep@regtest", [
          {
            public_address: "mockPublicAddress",
            chain_code: "mockChainCode",
            token_code: "mockTokenCode",
          },
          {
            public_address: "mockPublicAddress",
            chain_code: "mockChainCode",
            token_code: "mockTokenCode",
          },
          {
            public_address: "mockPublicAddress",
            chain_code: "mockChainCode",
            token_code: "mockTokenCode",
          },
          {
            public_address: "mockPublicAddress",
            chain_code: "mockChainCode",
            token_code: "mockTokenCode",
          },
          {
            public_address: "mockPublicAddress",
            chain_code: "mockChainCode",
            token_code: "mockTokenCode",
          },
          {
            public_address: "mockPublicAddress",
            chain_code: "mockChainCode",
            token_code: "mockTokenCode",
          },
        ])
      ).rejects.toThrow(
        "Only maximum of 5 public addresses are allowed at a time."
      );
    });

    it("should throw on error", async () => {
      require("../src/utils").createRawTx.mockRejectedValueOnce(
        new Error("Test error")
      );

      const wallet = new FIOWallet({
        appId: "mockAppId",
        user: { email: "mockEmail" },
      });
      expect(
        wallet.mapHandle("mohitmetakeep@regtest", [
          {
            public_address: "mockPublicAddress",
            chain_code: "mockChainCode",
            token_code: "mockTokenCode",
          },
        ])
      ).rejects.toThrow("Test error");
    });
  });
});
