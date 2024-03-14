import { Fio } from "@fioprotocol/fiojs";
import { serializeActionData } from "@fioprotocol/fiojs/dist/chain-serialize";
import { base64ToBinary } from "@fioprotocol/fiojs/dist/chain-numeric";
import { Api } from "@fioprotocol/fiojs/dist/chain-api";
import { Transactions } from "@fioprotocol/fiosdk/lib/transactions/Transactions";
import { ActionData } from "./FIOWallet";

/**
 * Represents the parameters required for creating a raw transaction.
 */
interface CreateRawTxParams {
  publicKey: string;
  actionData: ActionData;
  account: string;
  action: string;
}

/**
 * Represents the parameters required for serializing action data.
 */
interface CreateSerializeActionDataParams {
  account: string;
  actionName: string;
  actionData: any;
  chainId: string;
}

/**
 * Represents the parameters required for broadcasting a transaction.
 */
interface BroadcastTransactionParams {
  rawTx: any;
  chainId: string;
  account: string;
  signature: string;
}

/**
 * Represents data from the blockchain chain.
 */
interface ChainData {
  chain_id: string;
  expiration: string;
  ref_block_num: number;
  ref_block_prefix: number;
}

/**
 * Represents an ABI provider.
 */
interface AbiProvider {
  getRawAbi: () => Promise<{ accountName: string; abi: Uint8Array }>;
}

/**
 * Represents the ABI for the FIO token.
 */
interface FioTokenAbi {
  account_name: string;
  abi: string;
}

/**
 * Represents the response of pushing a transaction.
 */
interface PushTransactionResponse {
  transaction_id: string;
  processed: {
    receipt: {
      status: string;
      cpu_usage_us: number;
      net_usage_words: number;
    };
  };
}

/**
 * Creates a raw transaction.
 * @param publicKey The public key.
 * @param actionData The action data.
 * @param account The account.
 * @param action The action.
 * @returns The raw transaction, serialized action data, and chain ID.
 */
export const createRawTx = async ({
  publicKey,
  actionData,
  account,
  action,
}: CreateRawTxParams): Promise<{
  rawTx: any;
  serializedActionData: string;
  chainId: string;
}> => {
  const chainData: ChainData = await getChainData();
  Transactions.FioProvider = {
    accountHash: Fio.accountHash,
  };

  const { fioTokenAbi } = await getAbiProvider(account);
  Transactions.abiMap.set(fioTokenAbi.account_name, fioTokenAbi);

  const serializedActionData = await createSerializeActionData({
    account,
    actionName: action,
    actionData,
    chainId: chainData.chain_id,
  });

  const transaction = new Transactions();
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

/**
 * Serializes action data.
 * @param account The account.
 * @param actionName The action name.
 * @param actionData The action data.
 * @param chainId The chain ID.
 * @returns The serialized action data.
 */
const createSerializeActionData = async ({
  account,
  actionName,
  actionData,
  chainId,
}: CreateSerializeActionDataParams): Promise<string> => {
  const { abiProvider } = await getAbiProvider(account);
  const fioApi = new Api({
    chainId: chainId,
    abiProvider: abiProvider,
  });
  const contract = await fioApi.getContract(account);
  const serializedActionData = serializeActionData(
    contract,
    account,a
    actionName,
    actionData
  );
  return serializedActionData;
};

/**
 * Gets the ABI provider and FIO token ABI.
 * @param account The account.
 * @returns The FIO token ABI and ABI provider.
 */
const getAbiProvider = async (
  account: string
): Promise<{ fioTokenAbi: FioTokenAbi; abiProvider: AbiProvider }> => {
  const fioTokenAbi: FioTokenAbi = await fetch(
    "https://fiotestnet.blockpane.com/v1/chain/get_raw_abi",
    {
      method: "POST",
      body: JSON.stringify({
        account_name: account,
      }),
    }
  ).then((res) => res.json());

  const abiMap = new Map<string, FioTokenAbi>();
  abiMap.set(account, fioTokenAbi);

  const abiProvider: AbiProvider = {
    getRawAbi: async () => {
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
 * Gets chain data.
 * @returns The chain data.
 */
const getChainData = async (): Promise<ChainData> => {
  const chainInfo = await fetch(
    "https://fiotestnet.blockpane.com/v1/chain/get_info",
    {
      method: "POST",
    }
  ).then((res) => res.json());

  const blockData = await fetch(
    "https://fiotestnet.blockpane.com/v1/chain/get_block",
    {
      method: "POST",
      body: JSON.stringify({
        block_num_or_id: chainInfo.last_irreversible_block_num,
      }),
    }
  ).then((res) => res.json());

  const chainData: ChainData = {
    chain_id: chainInfo.chain_id,
    expiration: new Date(new Date().getTime() + 120 * 1000)
      .toISOString()
      .split(".")[0],
    ref_block_num: blockData.block_num & 0xffff,
    ref_block_prefix: blockData.ref_block_prefix,
  };

  return chainData;
};

/**
 * Broadcasts a transaction.
 * @param rawTx The raw transaction.
 * @param chainId The chain ID.
 * @param account The account.
 * @param signature The transaction signature.
 * @returns The response of pushing the transaction.
 */
export const broadcastTx = async ({
  rawTx,
  chainId,
  account,
  signature,
}: BroadcastTransactionParams): Promise<PushTransactionResponse> => {
  const { fioTokenAbi } = await getAbiProvider(account);
  Transactions.abiMap.set(fioTokenAbi.account_name, fioTokenAbi);

  const transaction = new Transactions();
  const { serializedContextFreeData, serializedTransaction } =
    await transaction.serialize({
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

  const pushTransactionResponse = await fetch(
    "https://fiotestnet.blockpane.com/v1/chain/push_transaction",
    {
      method: "POST",
      body: JSON.stringify(pushTransactionArgs),
    }
  );

  const pushTransactionJson: PushTransactionResponse =
    await pushTransactionResponse.json();

  return pushTransactionJson;
};

/**
 * Converts an EOS public key to a FIO public key.
 * @param eosPubKey The EOS public key.
 * @returns The FIO public key.
 */
export const EOSPubKeyToFIOPubKey = (eosPubKey: string): string => {
  return "FIO" + eosPubKey.slice(3);
};
