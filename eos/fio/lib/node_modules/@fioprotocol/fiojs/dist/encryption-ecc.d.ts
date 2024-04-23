/// <reference types="node" />
export declare function eccEncrypt(privateKey: any, publicKey: any, message: Buffer, IV?: Buffer): Buffer;
export declare function eccDecrypt(privateKey: any, publicKey: any, message: Buffer): Buffer;
