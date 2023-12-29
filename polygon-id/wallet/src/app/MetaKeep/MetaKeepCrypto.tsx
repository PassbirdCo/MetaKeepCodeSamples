import {
  IKeyProvider,
  KmsKeyId,
  KmsKeyType,
  keyPath,
} from "@0xpolygonid/js-sdk";

import { BytesHelper, checkBigIntInField } from "@iden3/js-iden3-core";
import { MetaKeep } from "metakeep";

/**
 * A key provider that uses MetaKeep Cryptography Service for key management and signing.
 * @public
 * @class MetaKeepKeyProvider
 * @implements {IKeyProvider}
 */
export class MetaKeepKeyProvider implements IKeyProvider {
  /**
   * MetaKeep provides BabyJubJub keys.
   * @type {KmsKeyType}
   */
  keyType: KmsKeyType = KmsKeyType.BabyJubJub;

  /**
   * MetaKeep SDK instance.
   * @type {MetaKeep}
   */
  private _metakeepSdk: MetaKeep;

  /**
   * User's public key in hex string format(without leading 0x).
   * @type {string}
   */
  private _publicKey: string | undefined;

  /**
   * Creates an instance of MetaKeepKeyProvider.
   * @param {string} appId - MetaKeep App ID.
   * @param {string} email - User's email address.
   */
  constructor(appId: string, email: string, env: string = "prod") {
    if (!process.env.NEXT_PUBLIC_METAKEEP_APP_ID) {
      throw new Error("Missing MetaKeep App ID");
    }

    this._metakeepSdk = new MetaKeep({
      appId: appId,
      user: {
        email: email,
      },
      environment: env,
    });
  }

  /**
   * Gets public key by kmsKeyId
   *
   * @param {KmsKeyId} keyId - key identifier
   */
  async publicKey(keyID: KmsKeyId): Promise<string> {
    console.log("MetaKeep: public key requested for:", keyID);

    await this.validateKmsKeyId(keyID);

    return await this.getPublicKey();
  }

  /**
   * Signs prepared payload with a key id
   *
   * @param {KmsKeyId} keyId  - key identifier
   * @param {Uint8Array} data - data to sign (32 bytes)
   * @returns Uint8Array signature
   */
  async sign(
    keyId: KmsKeyId,
    data: Uint8Array,
    opts?: { [key: string]: unknown } | undefined
  ): Promise<Uint8Array> {
    console.debug("MetaKeep: signature requested");

    await this.validateKmsKeyId(keyId);

    if (data.length != 32) {
      throw new Error("data to sign is too large");
    }

    const i = BytesHelper.bytesToInt(data);
    if (!checkBigIntInField(i)) {
      throw new Error("data to sign is too large");
    }

    // MetaKeep expects bigint to be sent as a big-endian hex string
    const dataHexString = "0x" + i.toString(16).padStart(64, "0");

    // Sign the data
    const { signature } = await this._metakeepSdk.signMessage(
      dataHexString,
      // Signing reason. This can be customized to your application.
      "create a verified credential"
    );

    return Buffer.from(signature.slice(2), "hex");
  }

  /**
   * Generates a baby jub jub key from a seed phrase
   * MetaKeep does not support this so we return the user's public key
   * @param {Uint8Array} _seed - byte array seed
   * @returns kms key identifier
   */
  async newPrivateKeyFromSeed(_seed: Uint8Array): Promise<KmsKeyId> {
    console.debug("MetaKeep: new private key requested");

    // Seed is not used.
    // We generate Key ID from the user's public key.
    const publicKey = await this.getPublicKey();

    const kmsId = {
      type: this.keyType,
      id: keyPath(this.keyType, publicKey),
    };

    return kmsId;
  }

  private async getPublicKey(): Promise<string> {
    // Gets the public key from MetaKeep SDK if it's not already cached.
    if (this._publicKey) {
      return this._publicKey;
    }

    const { wallet } = await this._metakeepSdk.getWallet();

    let { publicKey } = wallet;

    if (!publicKey) {
      throw new Error("Missing public key");
    }

    // Remove the leading 0x
    publicKey = publicKey.slice(2);

    this._publicKey = publicKey;

    return publicKey;
  }

  private async validateKmsKeyId(keyId: KmsKeyId): Promise<void> {
    if (keyId.type != this.keyType) {
      throw new Error(`Invalid key type {keyID.type}`);
    }

    if (keyId.id != keyPath(this.keyType, await this.getPublicKey())) {
      throw new Error("Invalid key id");
    }
  }
}
