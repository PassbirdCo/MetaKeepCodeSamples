/**
 * Represents the enum for environments
 */
export declare enum Environment {
    DEVELOPMENT = "DEVELOPMENT",
    PRODUCTION = "PRODUCTION"
}
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
 * Interface representing a public address object.
 */
export interface PublicAddress {
    /**
     * The chain code.
     * You can find all supported chain codes at: https://github.com/fioprotocol/fips/blob/master/fip-0015.md
     */
    chain_code: string;
    /**
     * The token code.
     * You can find all supported token codes at: https://github.com/fioprotocol/fips/blob/master/fip-0015.md
     */
    token_code: string;
    /**
     * The public address.
     */
    public_address: string;
}
/**
 * Represents the action data required for mapping a public address to a FIO address.
 */
export interface ActionData {
    fio_address: string;
    public_addresses: PublicAddress[];
    max_fee: number;
    tpid: string;
    actor: string;
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
/** Retrieves raw ABIs for a specified accountName */
export interface AbiProvider {
    /** Retrieve the BinaryAbi */
    getRawAbi: (accountName: string) => Promise<BinaryAbi>;
}
/** Structure for the raw form of ABIs */
export interface BinaryAbi {
    /** account which has deployed the ABI */
    accountName: string;
    /** abi in binary form */
    abi: Uint8Array;
}
/**
 * Represents the response of pushing a transaction.
 */
export interface PushTransactionResponse {
    transaction_id: string;
    processed: {
        receipt: {
            status: string;
            cpu_usage_us: number;
            net_usage_words: number;
        };
    };
}
export declare const ADD_ADDRESS_ACTION = "addaddress";
export declare const FIO_ADDRESS_ACCOUNT = "fio.address";
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
export declare const createRawTx: ({ publicKey, actionData, account, action, fioBaseUrl, }: CreateRawTxParams) => Promise<{
    rawTx: any;
    serializedActionData: string;
    chainId: string;
}>;
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
export declare const broadcastTx: ({ rawTx, chainId, account, signature, fioBaseUrl, }: BroadcastTransactionParams) => Promise<PushTransactionResponse>;
/**
 * Converts an EOS public key to a FIO public key.
 * Since the FIO public key is derived from the EOS public key, we can
 * replace the first 3 characters of the EOS public key with "FIO".
 *
 * @param eosPubKey The EOS public key.
 * @returns The FIO public key.
 */
export declare const EOSPubKeyToFIOPubKey: (eosPubKey: string) => string;
export {};
