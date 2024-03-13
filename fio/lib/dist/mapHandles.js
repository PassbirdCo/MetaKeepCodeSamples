"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapHandle = void 0;
const metakeep_1 = require("metakeep");
const utils_1 = require("./utils");
const fiojs_1 = require("@fioprotocol/fiojs");
const getFioAddress = (email) => email.replace(/[^a-zA-Z0-9]/g, "") + "@fiotestnet";
const signTransaction = async ({ sdk, rawTx, chainId, fioAddress, }) => {
    const response = await sdk.signTransaction({ rawTransaction: rawTx, extraSigningData: { chainId: chainId } }, `register FIO Address "${fioAddress}"`);
    return response;
};
async function mapHandle({ appId, email, publicAddress, chainCode, tokenCode, }) {
    var _a;
    try {
        const sdk = new metakeep_1.MetaKeep({
            appId: appId || "",
            user: { email },
        });
        const wallet = await sdk.getWallet();
        const fioPubKey = (0, utils_1.EOSPubKeyToFIOPubKey)(wallet.wallet.eosAddress);
        const fioAddress = getFioAddress(email);
        const actionData = {
            fio_address: fioAddress,
            public_addresses: [
                {
                    chain_code: chainCode,
                    token_code: tokenCode,
                    public_address: publicAddress,
                },
            ],
            max_fee: 10000000000000,
            tpid: "",
            actor: fiojs_1.Fio.accountHash(fioPubKey),
        };
        const { rawTx, serializedActionData, chainId } = await (0, utils_1.createRawTx)({
            publicKey: fioPubKey,
            actionData: actionData,
            account: "fio.address",
            action: "addaddress",
        });
        const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
        rawTx.actions[0].data = serializedActionData;
        const response = await signTransaction({ sdk, rawTx, chainId, fioAddress });
        const signature = response.signature;
        const broadcastResponse = await (0, utils_1.broadcastTx)({
            rawTx: rawTxCopy,
            chainId,
            account: "fio.address",
            signature: signature,
        });
        if (broadcastResponse.transaction_id) {
            console.log("Map successful!");
        }
        else {
            console.error("Map failed!");
        }
        console.log("Transaction broadcastResponse: ", broadcastResponse);
    }
    catch (error) {
        console.error((_a = error.status) !== null && _a !== void 0 ? _a : error.message);
    }
}
exports.mapHandle = mapHandle;
