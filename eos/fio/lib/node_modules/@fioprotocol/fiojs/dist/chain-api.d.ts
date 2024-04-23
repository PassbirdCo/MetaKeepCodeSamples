/**
 * @module FIO
 */
import { AbiProvider, AuthorityProvider, BinaryAbi, CachedAbi, SignatureProvider } from './chain-api-interfaces';
import { Abi } from './chain-rpc-interfaces';
import * as ser from './chain-serialize';
export declare class Api {
    /** Get subset of `availableKeys` needed to meet authorities in a `transaction` */
    authorityProvider: AuthorityProvider;
    /** Supplies ABIs in raw form (binary) */
    abiProvider: AbiProvider;
    /** Signs transactions */
    signatureProvider: SignatureProvider;
    /** Identifies chain */
    chainId: string;
    textEncoder: TextEncoder;
    textDecoder: TextDecoder;
    /** Converts abi files between binary and structured form (`abi.abi.json`) */
    abiTypes: Map<string, ser.Type>;
    /** Converts transactions between binary and structured form (`transaction.abi.json`) */
    transactionTypes: Map<string, ser.Type>;
    /** Holds information needed to serialize contract actions */
    contracts: Map<string, ser.Contract>;
    /** Fetched abis */
    cachedAbis: Map<string, CachedAbi>;
    /**
     * @param args
     *    * `authorityProvider`: Get public keys needed to meet authorities in a transaction
     *    * `abiProvider`: Supplies ABIs in raw form (binary)
     *    * `signatureProvider`: Signs transactions
     *    * `chainId`: Identifies chain
     *    * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     *    * `textDecoder`: `TextDecoder` instance to use. Pass in `null` if running in a browser
     */
    constructor(args: {
        authorityProvider: AuthorityProvider;
        abiProvider: AbiProvider;
        signatureProvider: SignatureProvider;
        chainId: string;
        textEncoder?: TextEncoder;
        textDecoder?: TextDecoder;
    });
    /** Decodes an abi as Uint8Array into json. */
    rawAbiToJson(rawAbi: Uint8Array): Abi;
    /** Get abi in both binary and structured forms. Reload from AbiProvider when needed. */
    getCachedAbi(accountName: string, reload?: boolean): Promise<CachedAbi>;
    /** Get abi in structured form. Reload from AbiProvider when needed. */
    getAbi(accountName: string, reload?: boolean): Promise<Abi>;
    /** Get abis needed by a transaction */
    getTransactionAbis(transaction: any, reload?: boolean): Promise<BinaryAbi[]>;
    /** Get data needed to serialize actions in a contract */
    getContract(accountName: string, reload?: boolean): Promise<ser.Contract>;
    /** Convert `value` to binary form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    serialize(buffer: ser.SerialBuffer, type: string, value: any): void;
    /** Convert data in `buffer` to structured form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    deserialize(buffer: ser.SerialBuffer, type: string): any;
    /** Convert a transaction to binary */
    serializeTransaction(transaction: any): Uint8Array;
    /** Serialize context-free data */
    serializeContextFreeData(contextFreeData: Uint8Array[]): Uint8Array;
    /** Convert a transaction from binary. Leaves actions in hex. */
    deserializeTransaction(transaction: Uint8Array): any;
    /** Convert actions to hex */
    serializeActions(actions: ser.Action[]): Promise<ser.SerializedAction[]>;
    /** Convert actions from hex */
    deserializeActions(actions: ser.Action[]): Promise<ser.Action[]>;
    /** Convert a transaction from binary. Also deserializes actions. */
    deserializeTransactionWithActions(transaction: Uint8Array | string): Promise<any>;
    /**
     * Create a transaction.
     *
     * Named Parameters:
     *    * `sign`: sign this transaction?
     * @returns `{signatures, serializedTransaction}`
     */
    transact(transaction: any, { sign }?: {
        sign?: boolean;
    }): Promise<any>;
    private hasRequiredTaposFields;
}
/**
    Simple authority provider that signs with all provided keys.

    If their more availableKeys than are required to sign then the get_required_keys
    rpc call is required to filter them (tests/chain-jsonrpc.ts
    getRequiredKeys(authorityProviderArgs))
*/
export declare const signAllAuthorityProvider: AuthorityProvider;
