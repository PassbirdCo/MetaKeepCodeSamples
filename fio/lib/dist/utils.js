"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOSPubKeyToFIOPubKey = exports.broadcastTx = exports.createRawTx = void 0;
const fiojs_1 = require("@fioprotocol/fiojs");
const chain_serialize_1 = require("@fioprotocol/fiojs/dist/chain-serialize");
const chain_numeric_1 = require("@fioprotocol/fiojs/dist/chain-numeric");
const chain_api_1 = require("@fioprotocol/fiojs/dist/chain-api");
const Transactions_1 = require("@fioprotocol/fiosdk/lib/transactions/Transactions");
const createRawTx = async ({ publicKey, actionData, account, action, }) => {
    const chainData = await getChainData();
    Transactions_1.Transactions.FioProvider = {
        accountHash: fiojs_1.Fio.accountHash,
    };
    const { fioTokenAbi } = await getAbiProvider(account);
    Transactions_1.Transactions.abiMap.set(fioTokenAbi.account_name, fioTokenAbi);
    const serializedActionData = await createSerializeActionData({
        account,
        actionName: action,
        actionData,
        chainId: chainData.chain_id,
    });
    const transaction = new Transactions_1.Transactions();
    const rawTx = await transaction.createRawTransaction({
        action: action,
        account: account,
        data: actionData,
        chainData: chainData,
        publicKey: publicKey,
    });
    return {
        rawTx,
        serializedActionData,
        chainId: chainData.chain_id,
    };
};
exports.createRawTx = createRawTx;
const createSerializeActionData = async ({ account, actionName, actionData, chainId, }) => {
    const { abiProvider } = await getAbiProvider(account);
    const fioApi = new chain_api_1.Api({
        chainId: chainId,
        abiProvider: abiProvider,
    });
    const contract = await fioApi.getContract(account);
    const serializedActionData = (0, chain_serialize_1.serializeActionData)(contract, account, actionName, actionData);
    return serializedActionData;
};
const getAbiProvider = async (account) => {
    const fioTokenAbi = await fetch("https://fiotestnet.blockpane.com/v1/chain/get_raw_abi", {
        method: "POST",
        body: JSON.stringify({
            account_name: account,
        }),
    }).then((res) => res.json());
    const abiMap = new Map();
    abiMap.set(account, fioTokenAbi);
    const abiProvider = {
        getRawAbi: async () => {
            const rawAbi = abiMap.get(account);
            if (!rawAbi)
                throw new Error("Missing abi for " + account);
            const abi = (0, chain_numeric_1.base64ToBinary)(rawAbi.abi);
            const binaryAbi = {
                accountName: rawAbi.account_name,
                abi: abi,
            };
            return binaryAbi;
        },
    };
    return { fioTokenAbi, abiProvider };
};
const getChainData = async () => {
    const chainInfo = await fetch("https://fiotestnet.blockpane.com/v1/chain/get_info", {
        method: "POST",
    }).then((res) => res.json());
    const blockData = await fetch("https://fiotestnet.blockpane.com/v1/chain/get_block", {
        method: "POST",
        body: JSON.stringify({
            block_num_or_id: chainInfo.last_irreversible_block_num,
        }),
    }).then((res) => res.json());
    const chainData = {
        chain_id: chainInfo.chain_id,
        expiration: new Date(new Date().getTime() + 120 * 1000)
            .toISOString()
            .split(".")[0],
        ref_block_num: blockData.block_num & 0xffff,
        ref_block_prefix: blockData.ref_block_prefix,
    };
    return chainData;
};
const broadcastTx = async ({ rawTx, chainId, account, signature, }) => {
    const { fioTokenAbi } = await getAbiProvider(account);
    Transactions_1.Transactions.abiMap.set(fioTokenAbi.account_name, fioTokenAbi);
    const transaction = new Transactions_1.Transactions();
    const { serializedContextFreeData, serializedTransaction } = await transaction.serialize({
        chainId,
        transaction: rawTx,
    });
    const pushTransactionArgs = {
        signatures: [signature],
        packed_trx: Buffer.from(serializedTransaction).toString("hex"),
        packed_context_free_data: serializedContextFreeData
            ? Buffer.from(serializedContextFreeData).toString("hex")
            : "",
        compression: 0,
    };
    const pushTransactionResponse = await fetch("https://fiotestnet.blockpane.com/v1/chain/push_transaction", {
        method: "POST",
        body: JSON.stringify(pushTransactionArgs),
    });
    const pushTransactionJson = await pushTransactionResponse.json();
    return pushTransactionJson;
};
exports.broadcastTx = broadcastTx;
const EOSPubKeyToFIOPubKey = (eosPubKey) => {
    return "FIO" + eosPubKey.slice(3);
};
exports.EOSPubKeyToFIOPubKey = EOSPubKeyToFIOPubKey;
