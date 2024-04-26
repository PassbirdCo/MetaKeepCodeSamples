"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIOWallet = void 0;
const metakeep_1 = require("metakeep");
const fiojs_1 = require("@fioprotocol/fiojs");
const utils_1 = require("./utils");
/**
 * Represents a FIO Wallet.
 */
class FIOWallet {
    /**
     * Constructs a new instance of FIOWallet.
     * @param {FIOWalletOptions} options The options object which includes appId, user, and environment.
     */
    constructor(options) {
        this.options = options;
        if (!this.options.appId || typeof this.options.appId !== "string") {
            throw new Error("App ID must be a non-empty string.");
        }
        if (!this.options.env) {
            this.options.env = utils_1.Environment.PRODUCTION;
        }
        if (![utils_1.Environment.PRODUCTION, utils_1.Environment.DEVELOPMENT].includes(this.options.env)) {
            throw new Error('Environment must be either "PRODUCTION" or "DEVELOPMENT".');
        }
        // Initialize the Metakeep SDK
        this.sdk = new metakeep_1.MetaKeep({
            appId: this.options.appId || "",
            user: this.options.user,
        });
        this.fioBaseUrl =
            this.options.env === utils_1.Environment.DEVELOPMENT
                ? "https://fiotestnet.blockpane.com/v1"
                : "https://fio.blockpane.com/v1";
    }
    /**
     * Maps a public address to a FIO handle.
     * @param {String} fioHandle The FIO handle.
     * @param {UserAddress[]} addresses An array of objects representing user's addresses which should not exceed length of 5.
     *                      Each object should have the properties: chain, and address.
     * @param {String} reason An optional reason for mapping the addresses that will be displayed to the user at the time of signing.
     * If not provided, a default message will be displayed.
     * @returns {Promise<any>} A Promise that resolves with the mapping result.
     * @throws {Error} If more than 5 public addresses are provided.
     */
    async mapHandle(fioHandle, addresses, reason) {
        if (addresses.length > 5) {
            throw new Error("Only maximum of 5 public addresses are allowed at a time.");
        }
        // Get the user's wallet from the Metakeep SDK
        const wallet = await this.sdk.getWallet();
        // Convert the EOS public key to FIO public key
        const fioPubKey = (0, utils_1.EOSPubKeyToFIOPubKey)(wallet.wallet.eosAddress);
        const actionData = {
            fio_address: fioHandle,
            public_addresses: addresses.map((address) => ({
                chain_code: address.chain,
                // For now, we are mapping all tokens to the same public address.
                token_code: "*",
                public_address: address.address,
            })),
            max_fee: 10000000000000,
            tpid: "",
            actor: fiojs_1.Fio.accountHash(fioPubKey),
        };
        // Create the raw transaction
        const { rawTx, serializedActionData, chainId } = await (0, utils_1.createRawTx)({
            publicKey: fioPubKey,
            actionData: actionData,
            account: utils_1.FIO_ADDRESS_ACCOUNT,
            action: utils_1.ADD_ADDRESS_ACTION,
            fioBaseUrl: this.fioBaseUrl,
        });
        // Create a copy of the raw transaction to update action data
        // with serialized action data.
        const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
        rawTx.actions[0].data = serializedActionData;
        // Sign the transaction using the Metakeep SDK.
        const response = await this.sdk.signTransaction({ rawTransaction: rawTx, extraSigningData: { chainId: chainId } }, reason ||
            `map your FIO handle "${fioHandle}" to ${addresses.length} public address(es).`);
        const signature = response.signature;
        // Broadcast the transaction to the FIO chain nodes.
        const broadcastResponse = await (0, utils_1.broadcastTx)({
            rawTx: rawTxCopy,
            chainId,
            account: utils_1.FIO_ADDRESS_ACCOUNT,
            signature: signature,
            fioBaseUrl: this.fioBaseUrl,
        });
        return broadcastResponse;
    }
}
exports.FIOWallet = FIOWallet;
