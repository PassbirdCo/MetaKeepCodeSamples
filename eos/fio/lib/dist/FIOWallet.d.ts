import { PushTransactionResponse, Environment } from "./utils";
/**
 * Represents the available options to the FIOWallet constructor
 */
export interface FIOWalletOptions {
    appId: string;
    user: {
        email: string;
    };
    env?: Environment;
}
/**
 * Represents a user's address on a particular chain.
 */
export interface UserAddress {
    chain: string;
    address: string;
}
/**
 * Represents a FIO Wallet.
 */
declare class FIOWallet {
    private options;
    private sdk;
    private fioBaseUrl;
    /**
     * Constructs a new instance of FIOWallet.
     * @param {FIOWalletOptions} options The options object which includes appId, user, and environment.
     */
    constructor(options: FIOWalletOptions);
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
    mapHandle(fioHandle: string, addresses: UserAddress[], reason?: string): Promise<PushTransactionResponse>;
}
export { FIOWallet };
