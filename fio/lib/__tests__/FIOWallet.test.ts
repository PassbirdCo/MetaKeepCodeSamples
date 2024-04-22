import { FioWallet } from "../src/FIOWallet";

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

jest.mock("../src/utils", () => ({
  EOSPubKeyToFIOPubKey: jest.fn().mockReturnValue("FIO12345"),
  createRawTx: jest.fn().mockResolvedValue({
    rawTx: { actions: [{ data: "mockData" }] },
    serializedActionData: "mockSerializedData",
    chainId: "mockChainId",
  }),
  broadcastTx: jest
    .fn()
    .mockResolvedValue({ transaction_id: "mockTransactionId" }),
}));

jest.mock("@fioprotocol/fiojs", () => ({
  Fio: {
    accountHash: jest.fn().mockReturnValue("FIO12345"),
  },
}));

const errorLogSpy = jest.spyOn(console, "error");

describe("FioWallet", () => {
  describe("mapHandle", () => {
    it("should map a public address to a FIO address", async () => {
      const wallet = new FioWallet(
        "regtest",
        "https://fiotestnet.blockpane.com/v1",
        "mockAppId",
        "mockEmail"
      );
      await wallet.mapHandle({
        publicAddress: "mockPublicAddress",
        chainCode: "mockChainCode",
        tokenCode: "mockTokenCode",
      });

      expect(wallet["sdk"]).toBeDefined();
      expect(wallet["fioPubKey"]).toBe("FIO12345");
      expect(wallet["fioAddress"]).toBe("mockEmail@regtest");

      expect(require("../src/utils").createRawTx).toHaveBeenCalledWith({
        publicKey: "FIO12345",
        actionData: {
          fio_address: "mockEmail@regtest",
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
        `register FIO Address "mockEmail@regtest"`
      );

      expect(require("../src/utils").broadcastTx).toHaveBeenCalledWith({
        rawTx: { actions: [{ data: "mockData" }] },
        chainId: "mockChainId",
        account: "fio.address",
        signature: "mockSignature",
        fioBaseUrl: "https://fiotestnet.blockpane.com/v1",
      });
    });

    it("should handle errors gracefully", async () => {
      require("../src/utils").createRawTx.mockRejectedValueOnce(
        new Error("Test error")
      );

      const wallet = new FioWallet(
        "regtest",
        "https://fiotestnet.blockpane.com/v1",
        "mockAppId",
        "mockEmail"
      );
      await wallet.mapHandle({
        publicAddress: "mockPublicAddress",
        chainCode: "mockChainCode",
        tokenCode: "mockTokenCode",
      });

      expect(errorLogSpy).toHaveBeenCalledWith("Test error");
      errorLogSpy.mockRestore();
    });
  });
});
