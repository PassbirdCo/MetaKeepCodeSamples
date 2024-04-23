/**
 * Interface representing a public address object.
 */
interface PublicAddress {
    /**
     * The chain code.
     */
    chain_code: string;
    /**
     * The token code.
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
 * Represents a FIO Wallet.
 */
declare class FIOWallet {
    private appId;
    private user;
    private env;
    private sdk;
    private fioBaseUrl;
    /**
     * Constructs a new instance of FIOWallet.
     * @param {String} appId The application ID.
     * @param {Object} user The user object which includes email.
     * @param {String} env The environment, either "DEVELOPMENT" or "PRODUCTION". Optional, defaults to "PRODUCTION".
     */
    constructor(appId: string, user: {
        email: string;
    }, env?: "PRODUCTION" | "DEVELOPMENT");
    /**
     * Maps a public address to a FIO address.
     * @param {String} fioHandle The FIO handle.
     * @param {PublicAddress[]} publicAddresses An array of objects representing public addresses which should not exceed length of 5.
     *                      Each object should have the properties: chain_code, token_code, and public_address.
     * @returns {Promise<any>} A Promise that resolves with the mapping result.
     * @throws {Error} If more than 5 public addresses are provided.
     */
    mapHandle(fioHandle: string, publicAddresses: PublicAddress[]): Promise<any>;
}
export { FIOWallet };
