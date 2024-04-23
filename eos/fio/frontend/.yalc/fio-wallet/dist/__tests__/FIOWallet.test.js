"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FIOWallet_1 = require("../src/FIOWallet");
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
describe("FIOWallet", () => {
    describe("mapHandle", () => {
        it("should map a public address to a FIO address", async () => {
            const wallet = new FIOWallet_1.FIOWallet("mockAppId", {
                email: "mohit@metakeep.xyz",
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
            expect(wallet["sdk"]["signTransaction"]).toHaveBeenCalledWith({
                rawTransaction: { actions: [{ data: "mockSerializedData" }] },
                extraSigningData: { chainId: "mockChainId" },
            }, `Map FIO handle "mohitmetakeep@regtest"`);
            expect(require("../src/utils").broadcastTx).toHaveBeenCalledWith({
                rawTx: { actions: [{ data: "mockData" }] },
                chainId: "mockChainId",
                account: "fio.address",
                signature: "mockSignature",
                fioBaseUrl: "https://fio.blockpane.com/v1",
            });
        });
        it("should use development base url if env set to DEVELOPMENT", async () => {
            const wallet = new FIOWallet_1.FIOWallet("mockAppId", {
                email: "mohit@metakeep.xyz",
            }, "DEVELOPMENT");
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
            expect(wallet["sdk"]["signTransaction"]).toHaveBeenCalledWith({
                rawTransaction: { actions: [{ data: "mockSerializedData" }] },
                extraSigningData: { chainId: "mockChainId" },
            }, `Map FIO handle "mohitmetakeep@regtest"`);
            expect(require("../src/utils").broadcastTx).toHaveBeenCalledWith({
                rawTx: { actions: [{ data: "mockSerializedData" }] },
                chainId: "mockChainId",
                account: "fio.address",
                signature: "mockSignature",
                fioBaseUrl: "https://fiotestnet.blockpane.com/v1",
            });
        });
        it("should throw error if more than 5 addressess are provided", async () => {
            const wallet = new FIOWallet_1.FIOWallet("mockAppId", {
                email: "mohit@metakeep.xyz",
            });
            expect(wallet.mapHandle("mohitmetakeep@regtest", [
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
            ])).rejects.toThrow("Only 5 public addresses are allowed.");
        });
        it("should handle errors gracefully", async () => {
            require("../src/utils").createRawTx.mockRejectedValueOnce(new Error("Test error"));
            const wallet = new FIOWallet_1.FIOWallet("mockAppId", { email: "mockEmail" });
            expect(wallet.mapHandle("mohitmetakeep@regtest", [
                {
                    public_address: "mockPublicAddress",
                    chain_code: "mockChainCode",
                    token_code: "mockTokenCode",
                },
            ])).rejects.toThrow("Test error");
        });
    });
});
//# sourceMappingURL=FIOWallet.test.js.map