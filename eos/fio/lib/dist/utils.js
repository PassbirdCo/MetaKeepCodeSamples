"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOSPubKeyToFIOPubKey =
  exports.broadcastTx =
  exports.createRawTx =
  exports.FIO_ADDRESS_ACCOUNT =
  exports.ADD_ADDRESS_ACTION =
  exports.Environment =
    void 0;
const fiojs_1 = require("@fioprotocol/fiojs");
const chain_serialize_1 = require("@fioprotocol/fiojs/dist/chain-serialize");
const chain_numeric_1 = require("@fioprotocol/fiojs/dist/chain-numeric");
const chain_api_1 = require("@fioprotocol/fiojs/dist/chain-api");
const Transactions_1 = require("@fioprotocol/fiosdk/lib/transactions/Transactions");
/**
 * Represents the enum for environments
 */
var Environment;
(function (Environment) {
  Environment["DEVELOPMENT"] = "DEVELOPMENT";
  Environment["PRODUCTION"] = "PRODUCTION";
})(Environment || (exports.Environment = Environment = {}));
exports.ADD_ADDRESS_ACTION = "addaddress";
exports.FIO_ADDRESS_ACCOUNT = "fio.address";
const FIO_ABI_MAP = new Map([
  [
    exports.FIO_ADDRESS_ACCOUNT,
    {
      abi: "DmVvc2lvOjphYmkvMS4wACAHZmlvbmFtZQAJAmlkBnVpbnQ2NARuYW1lBnN0cmluZwhuYW1laGFzaAd1aW50MTI4BmRvbWFpbgZzdHJpbmcKZG9tYWluaGFzaAd1aW50MTI4CmV4cGlyYXRpb24GdWludDY0DW93bmVyX2FjY291bnQEbmFtZQlhZGRyZXNzZXMOdG9rZW5wdWJhZGRyW10XYnVuZGxlZWxpZ2libGVjb3VudGRvd24GdWludDY0EWZpb25hbWVfaW5mb19pdGVtAAQCaWQGdWludDY0CWZpb25hbWVpZAZ1aW50NjQIZGF0YWRlc2MGc3RyaW5nCWRhdGF2YWx1ZQZzdHJpbmcGZG9tYWluAAYCaWQGdWludDY0BG5hbWUGc3RyaW5nCmRvbWFpbmhhc2gHdWludDEyOAdhY2NvdW50BG5hbWUJaXNfcHVibGljBXVpbnQ4CmV4cGlyYXRpb24GdWludDY0CmVvc2lvX25hbWUAAwdhY2NvdW50BG5hbWUJY2xpZW50a2V5BnN0cmluZwdrZXloYXNoB3VpbnQxMjgLbmZ0YnVybmluZm8AAgJpZAZ1aW50NjQQZmlvX2FkZHJlc3NfaGFzaAd1aW50MTI4CnJlZ2FkZHJlc3MABQtmaW9fYWRkcmVzcwZzdHJpbmcUb3duZXJfZmlvX3B1YmxpY19rZXkGc3RyaW5nB21heF9mZWUFaW50NjQFYWN0b3IEbmFtZQR0cGlkBnN0cmluZwt1cGRjcnlwdGtleQAFC2Zpb19hZGRyZXNzBnN0cmluZxJlbmNyeXB0X3B1YmxpY19rZXkGc3RyaW5nB21heF9mZWUFaW50NjQFYWN0b3IEbmFtZQR0cGlkBnN0cmluZwlyZWdkb21hZGQABgtmaW9fYWRkcmVzcwZzdHJpbmcJaXNfcHVibGljBGludDgUb3duZXJfZmlvX3B1YmxpY19rZXkGc3RyaW5nB21heF9mZWUFaW50NjQEdHBpZAZzdHJpbmcFYWN0b3IEbmFtZQx0b2tlbnB1YmFkZHIAAwp0b2tlbl9jb2RlBnN0cmluZwpjaGFpbl9jb2RlBnN0cmluZw5wdWJsaWNfYWRkcmVzcwZzdHJpbmcIbmZ0cGFyYW0ABgpjaGFpbl9jb2RlBnN0cmluZxBjb250cmFjdF9hZGRyZXNzBnN0cmluZwh0b2tlbl9pZAZzdHJpbmcDdXJsBnN0cmluZwRoYXNoBnN0cmluZwhtZXRhZGF0YQZzdHJpbmcLcmVtbmZ0cGFyYW0AAwpjaGFpbl9jb2RlBnN0cmluZxBjb250cmFjdF9hZGRyZXNzBnN0cmluZwh0b2tlbl9pZAZzdHJpbmcHbmZ0aW5mbwANAmlkBnVpbnQ2NAtmaW9fYWRkcmVzcwZzdHJpbmcKY2hhaW5fY29kZQZzdHJpbmcPY2hhaW5fY29kZV9oYXNoBnVpbnQ2NAh0b2tlbl9pZAZzdHJpbmcNdG9rZW5faWRfaGFzaAd1aW50MTI4A3VybAZzdHJpbmcQZmlvX2FkZHJlc3NfaGFzaAd1aW50MTI4EGNvbnRyYWN0X2FkZHJlc3MGc3RyaW5nFWNvbnRyYWN0X2FkZHJlc3NfaGFzaAd1aW50MTI4BGhhc2gGc3RyaW5nCmhhc2hfaW5kZXgHdWludDEyOAhtZXRhZGF0YQZzdHJpbmcKYWRkYWRkcmVzcwAFC2Zpb19hZGRyZXNzBnN0cmluZxBwdWJsaWNfYWRkcmVzc2VzDnRva2VucHViYWRkcltdB21heF9mZWUFaW50NjQFYWN0b3IEbmFtZQR0cGlkBnN0cmluZwpyZW1hZGRyZXNzAAULZmlvX2FkZHJlc3MGc3RyaW5nEHB1YmxpY19hZGRyZXNzZXMOdG9rZW5wdWJhZGRyW10HbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCnJlbWFsbGFkZHIABAtmaW9fYWRkcmVzcwZzdHJpbmcHbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCXJlZ2RvbWFpbgAFCmZpb19kb21haW4Gc3RyaW5nFG93bmVyX2Zpb19wdWJsaWNfa2V5BnN0cmluZwdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcLcmVuZXdkb21haW4ABApmaW9fZG9tYWluBnN0cmluZwdtYXhfZmVlBWludDY0BHRwaWQGc3RyaW5nBWFjdG9yBG5hbWUMcmVuZXdhZGRyZXNzAAQLZmlvX2FkZHJlc3MGc3RyaW5nB21heF9mZWUFaW50NjQEdHBpZAZzdHJpbmcFYWN0b3IEbmFtZQxzZXRkb21haW5wdWIABQpmaW9fZG9tYWluBnN0cmluZwlpc19wdWJsaWMEaW50OAdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcKYnVybmRvbWFpbgACCmRvbWFpbm5hbWUGc3RyaW5nCWRvbWFpbmlkeAZ1aW50NjQLYnVybmV4cGlyZWQAAgZvZmZzZXQGdWludDY0BWxpbWl0BnVpbnQzMgtkZWNyY291bnRlcgACC2Zpb19hZGRyZXNzBnN0cmluZwRzdGVwBWludDMyCmJpbmQyZW9zaW8AAwdhY2NvdW50BG5hbWUKY2xpZW50X2tleQZzdHJpbmcIZXhpc3RpbmcEYm9vbAtidXJuYWRkcmVzcwAEC2Zpb19hZGRyZXNzBnN0cmluZwdtYXhfZmVlBWludDY0BHRwaWQGc3RyaW5nBWFjdG9yBG5hbWUKeGZlcmRvbWFpbgAFCmZpb19kb21haW4Gc3RyaW5nGG5ld19vd25lcl9maW9fcHVibGljX2tleQZzdHJpbmcHbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nC3hmZXJhZGRyZXNzAAULZmlvX2FkZHJlc3MGc3RyaW5nGG5ld19vd25lcl9maW9fcHVibGljX2tleQZzdHJpbmcHbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCmFkZGJ1bmRsZXMABQtmaW9fYWRkcmVzcwZzdHJpbmcLYnVuZGxlX3NldHMFaW50NjQHbWF4X2ZlZQVpbnQ2NAR0cGlkBnN0cmluZwVhY3RvcgRuYW1lBmFkZG5mdAAFC2Zpb19hZGRyZXNzBnN0cmluZwRuZnRzCm5mdHBhcmFtW10HbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nBnJlbW5mdAAFC2Zpb19hZGRyZXNzBnN0cmluZwRuZnRzDXJlbW5mdHBhcmFtW10HbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCnJlbWFsbG5mdHMABAtmaW9fYWRkcmVzcwZzdHJpbmcHbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCGJ1cm5uZnRzAAEFYWN0b3IEbmFtZQp4ZmVyZXNjcm93AAQKZmlvX2RvbWFpbgZzdHJpbmcKcHVibGljX2tleQZzdHJpbmcIaXNFc2Nyb3cEYm9vbAVhY3RvcgRuYW1lFwCuylNTdJFKC2RlY3Jjb3VudGVyAAAAxuqmZJi6CnJlZ2FkZHJlc3MAAADG6qZkUjIKYWRkYWRkcmVzcwAAAMbqpmSkugpyZW1hZGRyZXNzAADATcnEaKS6CnJlbWFsbGFkZHIAAACYzkiamLoJcmVnZG9tYWluAAAASMlImpi6CXJlZ2RvbWFkZAAAvIK5+otS1Qt1cGRjcnlwdGtleQAApjOSJq6mugtyZW5ld2RvbWFpbgCAsbopGa6mugxyZW5ld2FkZHJlc3MAAMB0RtI0rz4KYnVybmRvbWFpbgAAkrqudjWvPgtidXJuZXhwaXJlZABwdJ3OSJqywgxzZXRkb21haW5wdWIAAAB1mCqRpjsKYmluZDJlb3NpbwAAMFY3JTOvPgtidXJuYWRkcmVzcwAAwHRG0nTV6gp4ZmVyZG9tYWluAAAwVjclc9XqC3hmZXJhZGRyZXNzAAAAVjFNfVIyCmFkZGJ1bmRsZXMAAACnF2F11eoKeGZlcmVzY3JvdwAAAAAA5DVTMgZhZGRuZnQAAAAAAOQ1pboGcmVtbmZ0AAAAzmvGaKS6CnJlbWFsbG5mdHMAAAAAOK85rz4IYnVybm5mdHMABgAAAFhJM6lbA2k2NAECaWQBBnN0cmluZwdmaW9uYW1lAOiaTkkzqVsDaTY0AAARZmlvbmFtZV9pbmZvX2l0ZW0AAAAAT2ckTQNpNjQBAmlkAQZzdHJpbmcGZG9tYWluAEA1Mk9NETIDaTY0AQdhY2NvdW50AQZ1aW50NjQKZW9zaW9fbmFtZQAAAAAAgPOaA2k2NAAAB25mdGluZm8AAAB2Xn3ymgNpNjQBAmlkAQZ1aW50NjQLbmZ0YnVybmluZm8AAAAA=",
      abi_hash:
        "19a099047a11ee6c2a1d86b44b9100eba44ef85b60e33edfbdfcc58ff6ab7c56",
      account_name: exports.FIO_ADDRESS_ACCOUNT,
      code_hash:
        "72c258fbcb0b328960bdbc4fc521d76cc53e5517bb5f5f2bf991d08030ddae6b",
    },
  ],
]);
/**
 * Creates a raw transaction.
 * @param {Object} params The params required for creating raw transaction.
 * @param {String} params.publicKey The public key.
 * @param {String} params.actionData The action data.
 * @param {String} params.account The account.
 * @param {String} params.action The action.
 * @param {String} params.fioBaseUrl The base URL of the FIO blockchain API.
 * @returns The raw transaction, serialized action data, and chain ID.
 */
const createRawTx = async ({
  publicKey,
  actionData,
  account,
  action,
  fioBaseUrl,
}) => {
  const chainData = await getChainData(fioBaseUrl);
  Transactions_1.Transactions.FioProvider = {
    accountHash: fiojs_1.Fio.accountHash,
  };
  // Reference taken from
  // https://github.com/fioprotocol/fiosdk_typescript-examples/blob/c0000bf74b20fe824cc792faa121049d60f1bbfe/fio-recipe.offline-sign.js#L32-L35
  const { fioAccountAbi: fioAddressAbi } = await getABI(account);
  Transactions_1.Transactions.abiMap.set(
    fioAddressAbi.account_name,
    fioAddressAbi
  );
  // Serialize the action data. This is needed because MetaKeep expects
  // the action data to be sent as a serialized hex string.
  const serializedActionData = await createSerializeActionData({
    account,
    actionName: action,
    actionData,
    chainId: chainData.chain_id,
  });
  const transaction = new Transactions_1.Transactions();
  // Create the raw transaction
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
/**
 * Serializes action data.
 * @param {Object} params The params required to create the serialized action data.
 * @param {String} params.account The account.
 * @param {String} params.actionName The action name.
 * @param {String} params.actionData The action data.
 * @param {String} params.chainId The chain ID.
 * @returns The serialized action data.
 */
const createSerializeActionData = async ({
  account,
  actionName,
  actionData,
  chainId,
}) => {
  const { abiProvider } = await getABI(account);
  // @ts-ignore
  const fioApi = new chain_api_1.Api({
    chainId: chainId,
    abiProvider: abiProvider,
  });
  const contract = await fioApi.getContract(account);
  // @ts-ignore
  const serializedActionData = (0, chain_serialize_1.serializeActionData)(
    contract,
    account,
    actionName,
    actionData
  );
  return serializedActionData;
};
/**
 * Gets the ABI provider and ABI for a specified account.
 * @param account The account.
 * @returns The FIO account ABI and ABI provider.
 */
const getABI = async (account) => {
  const abiProvider = {
    getRawAbi: async (account) => {
      const rawAbi = FIO_ABI_MAP.get(account);
      if (!rawAbi) {
        throw new Error(`ABI not found for account ${account}`);
      }
      const abi = (0, chain_numeric_1.base64ToBinary)(rawAbi.abi);
      const binaryAbi = {
        accountName: rawAbi.account_name,
        abi: abi,
      };
      return binaryAbi;
    },
  };
  return { fioAccountAbi: FIO_ABI_MAP.get(account), abiProvider };
};
/**
 * Gets chain data.
 * @returns The chain data.
 */
const getChainData = async (fioBaseUrl) => {
  // Fetch chain info
  const chainInfoResponse = await fetch(`${fioBaseUrl}/chain/get_info`, {
    method: "POST",
  });
  if (!chainInfoResponse.ok) {
    throw new Error("Failed to fetch chain info");
  }
  const chainInfo = await chainInfoResponse.json();
  // Fetch block data using the last irreversible block number
  const blockDataResponse = await fetch(`${fioBaseUrl}/chain/get_block`, {
    method: "POST",
    body: JSON.stringify({
      block_num_or_id: chainInfo.last_irreversible_block_num,
    }),
  });
  if (!blockDataResponse.ok) {
    throw new Error("Failed to fetch block data");
  }
  const blockData = await blockDataResponse.json();
  const chainData = {
    chain_id: chainInfo.chain_id,
    // 2 minute expiration
    expiration: new Date(new Date().getTime() + 120 * 1000)
      .toISOString()
      .split(".")[0],
    ref_block_num: blockData.block_num & 0xffff,
    ref_block_prefix: blockData.ref_block_prefix,
  };
  return chainData;
};
/**
 * Broadcasts a transaction to the FIO blockchain.
 * @param {Object} params The parameters object containing the transaction details.
 * @param {String} params.rawTx The raw transaction data.
 * @param {String} params.chainId The chain ID of the FIO blockchain.
 * @param {String} params.account The FIO account initiating the transaction.
 * @param {String} params.signature The signature of the transaction.
 * @param {String} params.fioBaseUrl The base URL of the FIO blockchain API.
 * @returns The response of pushing the transaction.
 */
const broadcastTx = async ({
  rawTx,
  chainId,
  account,
  signature,
  fioBaseUrl,
}) => {
  const { fioAccountAbi } = await getABI(account);
  Transactions_1.Transactions.abiMap.set(
    fioAccountAbi.account_name,
    fioAccountAbi
  );
  const transaction = new Transactions_1.Transactions();
  const { serializedContextFreeData, serializedTransaction } =
    await transaction.serialize({
      chainId,
      transaction: rawTx,
    });
  // Create the push transaction args
  const pushTransactionArgs = {
    signatures: [signature],
    packed_trx: Buffer.from(serializedTransaction).toString("hex"),
    packed_context_free_data: serializedContextFreeData
      ? Buffer.from(serializedContextFreeData).toString("hex")
      : "",
    compression: 0,
  };
  // Push transaction to the network
  const pushTransactionResponse = await fetch(
    `${fioBaseUrl}/chain/push_transaction`,
    {
      method: "POST",
      body: JSON.stringify(pushTransactionArgs),
    }
  );
  if (!pushTransactionResponse.ok) {
    throw new Error("Failed to push transaction to the network");
  }
  const pushTransactionJson = await pushTransactionResponse.json();
  return pushTransactionJson;
};
exports.broadcastTx = broadcastTx;
/**
 * Converts an EOS public key to a FIO public key.
 * Since the FIO public key is derived from the EOS public key, we can
 * replace the first 3 characters of the EOS public key with "FIO".
 *
 * @param eosPubKey The EOS public key.
 * @returns The FIO public key.
 */
const EOSPubKeyToFIOPubKey = (eosPubKey) => {
  if (!eosPubKey.startsWith("EOS")) {
    throw new Error("Invalid EOS public key");
  }
  // Remove "EOS" prefix and prepend "FIO" to convert to FIO public key
  return "FIO" + eosPubKey.slice(3);
};
exports.EOSPubKeyToFIOPubKey = EOSPubKeyToFIOPubKey;
