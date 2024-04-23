/// <reference types="node" />
/**
    Provides AES-256-CBC encryption and message authentication. The CBC cipher is
    used for good platform native compatability.

    @see https://security.stackexchange.com/a/63134
    @see https://security.stackexchange.com/a/20493

    @arg {Buffer} secret - See PrivateKey.getSharedSecret()
    @arg {Buffer} message - plaintext
    @arg {Buffer} [IV = randomBytes(16)] - An unpredictable strong random value
        is required and supplied by default.  Unit tests may provide a static value
        to achieve predictable results.

    @throws {Error} IV must be 16 bytes
*/
export declare function checkEncrypt(secret: Buffer, message: Buffer, IV?: Buffer): Buffer;
/**
    Provides AES-256-CBC message authentication then decryption.

    @arg {Buffer} secret - See PrivateKey.getSharedSecret()
    @arg {Buffer} message - ciphertext (from checkEncrypt)

    @throws {Error} decrypt failed
*/
export declare function checkDecrypt(secret: Buffer, message: Buffer): Buffer;
