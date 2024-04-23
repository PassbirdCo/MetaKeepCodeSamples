/// <reference types="node" />
import * as ser from './chain-serialize';
/** Convert `value` to binary form. `type` must be a built-in abi type. */
export declare function serialize(serialBuffer: ser.SerialBuffer, type: string, value: any): void;
/** Convert data in `buffer` to structured form. `type` must be a built-in abi type. */
export declare function deserialize(serialBuffer: ser.SerialBuffer, type: string): any;
export declare function createSharedCipher({ privateKey, publicKey, textEncoder, textDecoder }?: {
    privateKey: any;
    publicKey: any;
    textEncoder?: TextEncoder;
    textDecoder?: TextDecoder;
}): SharedCipher;
declare class SharedCipher {
    sharedSecret: Buffer;
    textEncoder?: TextEncoder;
    textDecoder?: TextDecoder;
    constructor({ sharedSecret, textEncoder, textDecoder }?: {
        sharedSecret: Buffer;
        textEncoder?: TextEncoder;
        textDecoder?: TextDecoder;
    });
    /**
        Encrypt the content of a FIO message.

        @arg {string} fioContentType - `new_funds_content`, etc
        @arg {object} content
        @arg {Buffer} [IV = randomBytes(16)] - An unpredictable strong random value
            is required and supplied by default.  Unit tests may provide a static value
            to achieve predictable results.
        @return {string} cipher base64
    */
    encrypt(fioContentType: string, content: any, IV?: Buffer): string;
    /**
        Decrypt the content of a FIO message.

        @arg {string} fioContentType - `new_funds_content`, etc
        @arg {object} content - cipher base64
        @return {object} decrypted FIO object
    */
    decrypt(fioContentType: string, content: string): any;
    /**
        @example hashA(PublicKey.toBuffer())
        @arg {string|Buffer} key buffer
        @return {string} hex, one-way hash unique to this SharedCipher and key
    */
    hashA(key: Buffer): String;
}
export {};
