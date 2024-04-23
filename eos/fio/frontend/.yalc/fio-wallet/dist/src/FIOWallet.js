"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIOWallet = void 0;
const metakeep_1 = require("metakeep");
const fiojs_1 = require("@fioprotocol/fiojs");
const utils_1 = require("./utils");
const ADD_ADDRESS_ACTION = "addaddress";
const FIO_ADDRESS_ACCOUNT = "fio.address";
/**
 * Represents a FIO Wallet.
 */
class FIOWallet {
    /**
     * Constructs a new instance of FIOWallet.
     * @param {String} appId The application ID.
     * @param {Object} user The user object which includes email.
     * @param {String} env The environment, either "DEVELOPMENT" or "PRODUCTION". Optional, defaults to "PRODUCTION".
     */
    constructor(appId, user, env = "PRODUCTION") {
        this.appId = appId;
        this.user = user;
        this.env = env;
        if (!this.appId || typeof this.appId !== "string") {
            throw new Error("App ID must be a non-empty string.");
        }
        if (!["PRODUCTION", "DEVELOPMENT"].includes(env)) {
            throw new Error('Environment must be either "PRODUCTION" or "DEVELOPMENT".');
        }
        this.sdk = new metakeep_1.MetaKeep({
            appId: this.appId || "",
            user: this.user,
        });
        this.fioBaseUrl =
            this.env === "DEVELOPMENT"
                ? "https://fiotestnet.blockpane.com/v1"
                : "https://fio.blockpane.com/v1";
    }
    /**
     * Maps a public address to a FIO address.
     * @param {String} fioHandle The FIO handle.
     * @param {PublicAddress[]} publicAddresses An array of objects representing public addresses which should not exceed length of 5.
     *                      Each object should have the properties: chain_code, token_code, and public_address.
     * @returns {Promise<any>} A Promise that resolves with the mapping result.
     * @throws {Error} If more than 5 public addresses are provided.
     */
    async mapHandle(fioHandle, publicAddresses) {
        if (publicAddresses.length > 5) {
            throw new Error("Only 5 public addresses are allowed.");
        }
        try {
            // Get the Metakeep wallet
            const wallet = await this.sdk.getWallet();
            // Convert the EOS public key to FIO public key
            const fioPubKey = (0, utils_1.EOSPubKeyToFIOPubKey)(wallet.wallet.eosAddress);
            const actionData = {
                fio_address: fioHandle,
                public_addresses: publicAddresses,
                max_fee: 10000000000000,
                tpid: "",
                actor: fiojs_1.Fio.accountHash(fioPubKey),
            };
            // Create the raw transaction
            const { rawTx, serializedActionData, chainId } = await (0, utils_1.createRawTx)({
                publicKey: fioPubKey,
                actionData: actionData,
                account: FIO_ADDRESS_ACCOUNT,
                action: ADD_ADDRESS_ACTION,
                fioBaseUrl: this.fioBaseUrl,
            });
            const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
            rawTx.actions[0].data = serializedActionData;
            console.log({ rawTxCopy });
            // Sign the transaction using the Metakeep SDK.
            const response = await this.sdk.signTransaction({ rawTransaction: rawTx, extraSigningData: { chainId: chainId } }, `Map FIO handle "${fioHandle}"`);
            const signature = response.signature;
            // Broadcast the transaction to the FIO chain nodes.
            const broadcastResponse = await (0, utils_1.broadcastTx)({
                rawTx: rawTxCopy,
                chainId,
                account: FIO_ADDRESS_ACCOUNT,
                signature: signature,
                fioBaseUrl: this.fioBaseUrl,
            });
            return broadcastResponse;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.FIOWallet = FIOWallet;
//# sourceMappingURL=FIOWallet.js.map