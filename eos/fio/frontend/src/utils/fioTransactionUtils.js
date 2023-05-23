const { Fio } = require("@fioprotocol/fiojs");
const {
  serializeActionData,
} = require("@fioprotocol/fiojs/dist/chain-serialize");
const { base64ToBinary } = require("@fioprotocol/fiojs/dist/chain-numeric");
const { Api } = require("@fioprotocol/fiojs/dist/chain-api");

const {
  Transactions,
} = require("@fioprotocol/fiosdk/lib/transactions/Transactions");

/**
 * Create a raw transaction and return the raw transaction with serialized action data.
 */
export const createRawTx = async (publicKey, actionData, account, action) => {
  const chainData = await getChainData();

  // Reference taken from
  // https://github.com/fioprotocol/fiosdk_typescript-examples/blob/c0000bf74b20fe824cc792faa121049d60f1bbfe/fio-recipe.offline-sign.js#L32-L35
  Transactions.FioProvider = {
    accountHash: Fio.accountHash,
  };

  const { fioTokenAbi } = await getAbiProvider(account);

  Transactions.abiMap.set(fioTokenAbi.account_name, fioTokenAbi);

  /*
   * Serialize the action data. This is needed because MetaKeep expects the
   * action data to be sent as a serialized hex string.
   */
  const serializedActionData = await createSerializeActionData(
    account,
    action,
    actionData,
    chainData.chain_id
  );

  const transaction = new Transactions();

  /* Creates the raw transaction */
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
    chain_id: chainData.chain_id,
  };
};

/**
 * Serializes and returns the action data.
 */
const createSerializeActionData = async (
  account,
  actionName,
  actionData,
  chainId
) => {
  const { abiProvider } = await getAbiProvider(account);

  const fioApi = new Api({
    chainId: chainId,
    abiProvider: abiProvider,
  });

  const contract = await fioApi.getContract(account);

  let serializedActionData = serializeActionData(
    contract,
    account,
    actionName,
    actionData
  );

  return serializedActionData;
};

/**
 * Creates abi provider for the given account.
 */
const getAbiProvider = async (account) => {
  // Fetch the ABI for the given account from the chain.
  const fioTokenAbi = await fetch(
    "https://fiotestnet.blockpane.com/v1/chain/get_raw_abi",
    {
      method: "POST",
      body: JSON.stringify({
        account_name: account,
      }),
    }
  ).then((res) => res.json());

  // Create the abi provider
  const abiMap = new Map();
  abiMap.set(account, fioTokenAbi);

  const abiProvider = {
    getRawAbi: async function () {
      const rawAbi = abiMap.get(account);
      if (!rawAbi) throw new Error("Missing abi for " + account);
      const abi = base64ToBinary(rawAbi.abi);
      const binaryAbi = {
        accountName: rawAbi.account_name,
        abi: abi,
      };
      return binaryAbi;
    },
  };

  return { fioTokenAbi, abiProvider };
};

/**
 * Fetches the chain related data.
 */
const getChainData = async () => {
  const chainInfo = await fetch(
    "https://fiotestnet.blockpane.com/v1/chain/get_info",
    {
      method: "POST",
    }
  ).then((res) => res.json());

  // Get the last irreversible block number
  const blockData = await fetch(
    "https://fiotestnet.blockpane.com/v1/chain/get_block",
    {
      method: "POST",
      body: JSON.stringify({
        block_num_or_id: chainInfo.last_irreversible_block_num,
      }),
    }
  ).then((res) => res.json());

  // Create the chain Data object
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
 * Broadcasts the transaction to the chain.
 */
export const broadcastTx = async (rawTx, chain_id, account, signature) => {
  const { fioTokenAbi } = await getAbiProvider(account);

  Transactions.abiMap.set(fioTokenAbi.account_name, fioTokenAbi);

  const transaction = new Transactions();
  const { serializedContextFreeData, serializedTransaction } =
    await transaction.serialize({
      chainId: chain_id,
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
    "https://fiotestnet.blockpane.com/v1/chain/push_transaction",
    {
      method: "POST",
      body: JSON.stringify(pushTransactionArgs),
    }
  );

  const pushTransactionJson = await pushTransactionResponse.json();

  return pushTransactionJson;
};

/**
 * Converts EOS public key to FIO public key.
 *
 * Since the FIO public key is derived from the EOS public key, we can simply
 * replace the first 3 characters of the EOS public key with "FIO".
 */
export const EOSPubKeyToFIOPubKey = (eosPubKey) => {
  return "FIO" + eosPubKey.slice(3);
};
