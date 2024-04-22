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
  fioBaseUrl: string;
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
  fioBaseUrl: string;
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
  abi_hash: string;
  code_hash: string;
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
  fioBaseUrl,
}: CreateRawTxParams): Promise<{
  rawTx: any;
  serializedActionData: string;
  chainId: string;
}> => {
  const chainData: ChainData = await getChainData(fioBaseUrl);
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
  // @ts-ignore
  const fioApi = new Api({
    chainId: chainId,
    abiProvider: abiProvider,
  });
  const contract = await fioApi.getContract(account);
  // @ts-ignore
  const serializedActionData = serializeActionData(
    contract,
    account,
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
  const fioTokenAbi: FioTokenAbi = {
    abi: "DmVvc2lvOjphYmkvMS4wACAHZmlvbmFtZQAJAmlkBnVpbnQ2NARuYW1lBnN0cmluZwhuYW1laGFzaAd1aW50MTI4BmRvbWFpbgZzdHJpbmcKZG9tYWluaGFzaAd1aW50MTI4CmV4cGlyYXRpb24GdWludDY0DW93bmVyX2FjY291bnQEbmFtZQlhZGRyZXNzZXMOdG9rZW5wdWJhZGRyW10XYnVuZGxlZWxpZ2libGVjb3VudGRvd24GdWludDY0EWZpb25hbWVfaW5mb19pdGVtAAQCaWQGdWludDY0CWZpb25hbWVpZAZ1aW50NjQIZGF0YWRlc2MGc3RyaW5nCWRhdGF2YWx1ZQZzdHJpbmcGZG9tYWluAAYCaWQGdWludDY0BG5hbWUGc3RyaW5nCmRvbWFpbmhhc2gHdWludDEyOAdhY2NvdW50BG5hbWUJaXNfcHVibGljBXVpbnQ4CmV4cGlyYXRpb24GdWludDY0CmVvc2lvX25hbWUAAwdhY2NvdW50BG5hbWUJY2xpZW50a2V5BnN0cmluZwdrZXloYXNoB3VpbnQxMjgLbmZ0YnVybmluZm8AAgJpZAZ1aW50NjQQZmlvX2FkZHJlc3NfaGFzaAd1aW50MTI4CnJlZ2FkZHJlc3MABQtmaW9fYWRkcmVzcwZzdHJpbmcUb3duZXJfZmlvX3B1YmxpY19rZXkGc3RyaW5nB21heF9mZWUFaW50NjQFYWN0b3IEbmFtZQR0cGlkBnN0cmluZwt1cGRjcnlwdGtleQAFC2Zpb19hZGRyZXNzBnN0cmluZxJlbmNyeXB0X3B1YmxpY19rZXkGc3RyaW5nB21heF9mZWUFaW50NjQFYWN0b3IEbmFtZQR0cGlkBnN0cmluZwlyZWdkb21hZGQABgtmaW9fYWRkcmVzcwZzdHJpbmcJaXNfcHVibGljBGludDgUb3duZXJfZmlvX3B1YmxpY19rZXkGc3RyaW5nB21heF9mZWUFaW50NjQEdHBpZAZzdHJpbmcFYWN0b3IEbmFtZQx0b2tlbnB1YmFkZHIAAwp0b2tlbl9jb2RlBnN0cmluZwpjaGFpbl9jb2RlBnN0cmluZw5wdWJsaWNfYWRkcmVzcwZzdHJpbmcIbmZ0cGFyYW0ABgpjaGFpbl9jb2RlBnN0cmluZxBjb250cmFjdF9hZGRyZXNzBnN0cmluZwh0b2tlbl9pZAZzdHJpbmcDdXJsBnN0cmluZwRoYXNoBnN0cmluZwhtZXRhZGF0YQZzdHJpbmcLcmVtbmZ0cGFyYW0AAwpjaGFpbl9jb2RlBnN0cmluZxBjb250cmFjdF9hZGRyZXNzBnN0cmluZwh0b2tlbl9pZAZzdHJpbmcHbmZ0aW5mbwANAmlkBnVpbnQ2NAtmaW9fYWRkcmVzcwZzdHJpbmcKY2hhaW5fY29kZQZzdHJpbmcPY2hhaW5fY29kZV9oYXNoBnVpbnQ2NAh0b2tlbl9pZAZzdHJpbmcNdG9rZW5faWRfaGFzaAd1aW50MTI4A3VybAZzdHJpbmcQZmlvX2FkZHJlc3NfaGFzaAd1aW50MTI4EGNvbnRyYWN0X2FkZHJlc3MGc3RyaW5nFWNvbnRyYWN0X2FkZHJlc3NfaGFzaAd1aW50MTI4BGhhc2gGc3RyaW5nCmhhc2hfaW5kZXgHdWludDEyOAhtZXRhZGF0YQZzdHJpbmcKYWRkYWRkcmVzcwAFC2Zpb19hZGRyZXNzBnN0cmluZxBwdWJsaWNfYWRkcmVzc2VzDnRva2VucHViYWRkcltdB21heF9mZWUFaW50NjQFYWN0b3IEbmFtZQR0cGlkBnN0cmluZwpyZW1hZGRyZXNzAAULZmlvX2FkZHJlc3MGc3RyaW5nEHB1YmxpY19hZGRyZXNzZXMOdG9rZW5wdWJhZGRyW10HbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCnJlbWFsbGFkZHIABAtmaW9fYWRkcmVzcwZzdHJpbmcHbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCXJlZ2RvbWFpbgAFCmZpb19kb21haW4Gc3RyaW5nFG93bmVyX2Zpb19wdWJsaWNfa2V5BnN0cmluZwdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcLcmVuZXdkb21haW4ABApmaW9fZG9tYWluBnN0cmluZwdtYXhfZmVlBWludDY0BHRwaWQGc3RyaW5nBWFjdG9yBG5hbWUMcmVuZXdhZGRyZXNzAAQLZmlvX2FkZHJlc3MGc3RyaW5nB21heF9mZWUFaW50NjQEdHBpZAZzdHJpbmcFYWN0b3IEbmFtZQxzZXRkb21haW5wdWIABQpmaW9fZG9tYWluBnN0cmluZwlpc19wdWJsaWMEaW50OAdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcKYnVybmRvbWFpbgACCmRvbWFpbm5hbWUGc3RyaW5nCWRvbWFpbmlkeAZ1aW50NjQLYnVybmV4cGlyZWQAAgZvZmZzZXQGdWludDY0BWxpbWl0BnVpbnQzMgtkZWNyY291bnRlcgACC2Zpb19hZGRyZXNzBnN0cmluZwRzdGVwBWludDMyCmJpbmQyZW9zaW8AAwdhY2NvdW50BG5hbWUKY2xpZW50X2tleQZzdHJpbmcIZXhpc3RpbmcEYm9vbAtidXJuYWRkcmVzcwAEC2Zpb19hZGRyZXNzBnN0cmluZwdtYXhfZmVlBWludDY0BHRwaWQGc3RyaW5nBWFjdG9yBG5hbWUKeGZlcmRvbWFpbgAFCmZpb19kb21haW4Gc3RyaW5nGG5ld19vd25lcl9maW9fcHVibGljX2tleQZzdHJpbmcHbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nC3hmZXJhZGRyZXNzAAULZmlvX2FkZHJlc3MGc3RyaW5nGG5ld19vd25lcl9maW9fcHVibGljX2tleQZzdHJpbmcHbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCmFkZGJ1bmRsZXMABQtmaW9fYWRkcmVzcwZzdHJpbmcLYnVuZGxlX3NldHMFaW50NjQHbWF4X2ZlZQVpbnQ2NAR0cGlkBnN0cmluZwVhY3RvcgRuYW1lBmFkZG5mdAAFC2Zpb19hZGRyZXNzBnN0cmluZwRuZnRzCm5mdHBhcmFtW10HbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nBnJlbW5mdAAFC2Zpb19hZGRyZXNzBnN0cmluZwRuZnRzDXJlbW5mdHBhcmFtW10HbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCnJlbWFsbG5mdHMABAtmaW9fYWRkcmVzcwZzdHJpbmcHbWF4X2ZlZQVpbnQ2NAVhY3RvcgRuYW1lBHRwaWQGc3RyaW5nCGJ1cm5uZnRzAAEFYWN0b3IEbmFtZQp4ZmVyZXNjcm93AAQKZmlvX2RvbWFpbgZzdHJpbmcKcHVibGljX2tleQZzdHJpbmcIaXNFc2Nyb3cEYm9vbAVhY3RvcgRuYW1lFwCuylNTdJFKC2RlY3Jjb3VudGVyAAAAxuqmZJi6CnJlZ2FkZHJlc3MAAADG6qZkUjIKYWRkYWRkcmVzcwAAAMbqpmSkugpyZW1hZGRyZXNzAADATcnEaKS6CnJlbWFsbGFkZHIAAACYzkiamLoJcmVnZG9tYWluAAAASMlImpi6CXJlZ2RvbWFkZAAAvIK5+otS1Qt1cGRjcnlwdGtleQAApjOSJq6mugtyZW5ld2RvbWFpbgCAsbopGa6mugxyZW5ld2FkZHJlc3MAAMB0RtI0rz4KYnVybmRvbWFpbgAAkrqudjWvPgtidXJuZXhwaXJlZABwdJ3OSJqywgxzZXRkb21haW5wdWIAAAB1mCqRpjsKYmluZDJlb3NpbwAAMFY3JTOvPgtidXJuYWRkcmVzcwAAwHRG0nTV6gp4ZmVyZG9tYWluAAAwVjclc9XqC3hmZXJhZGRyZXNzAAAAVjFNfVIyCmFkZGJ1bmRsZXMAAACnF2F11eoKeGZlcmVzY3JvdwAAAAAA5DVTMgZhZGRuZnQAAAAAAOQ1pboGcmVtbmZ0AAAAzmvGaKS6CnJlbWFsbG5mdHMAAAAAOK85rz4IYnVybm5mdHMABgAAAFhJM6lbA2k2NAECaWQBBnN0cmluZwdmaW9uYW1lAOiaTkkzqVsDaTY0AAARZmlvbmFtZV9pbmZvX2l0ZW0AAAAAT2ckTQNpNjQBAmlkAQZzdHJpbmcGZG9tYWluAEA1Mk9NETIDaTY0AQdhY2NvdW50AQZ1aW50NjQKZW9zaW9fbmFtZQAAAAAAgPOaA2k2NAAAB25mdGluZm8AAAB2Xn3ymgNpNjQBAmlkAQZ1aW50NjQLbmZ0YnVybmluZm8AAAAA=",
    abi_hash:
      "19a099047a11ee6c2a1d86b44b9100eba44ef85b60e33edfbdfcc58ff6ab7c56",
    account_name: "fio.address",
    code_hash:
      "72c258fbcb0b328960bdbc4fc521d76cc53e5517bb5f5f2bf991d08030ddae6b",
  };

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
const getChainData = async (fioBaseUrl: string): Promise<ChainData> => {
  const chainInfo = await fetch(`${fioBaseUrl}/chain/get_info`, {
    method: "POST",
  }).then((res) => res.json());

  const blockData = await fetch(`${fioBaseUrl}/chain/get_block`, {
    method: "POST",
    body: JSON.stringify({
      block_num_or_id: chainInfo.last_irreversible_block_num,
    }),
  }).then((res) => res.json());

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
  fioBaseUrl,
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
    `${fioBaseUrl}/chain/push_transaction`,
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
