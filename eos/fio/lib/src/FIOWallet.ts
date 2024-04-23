import { MetaKeep } from "metakeep";
import { Fio } from "@fioprotocol/fiojs";

import { EOSPubKeyToFIOPubKey, createRawTx, broadcastTx } from "./utils";


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

const ADD_ADDRESS_ACTION = "addaddress";
const FIO_ADDRESS_ACCOUNT = "fio.address";
/**
 * Represents a FIO Wallet.
 */
class FIOWallet {
  private sdk: MetaKeep;
  private fioBaseUrl: string;

  /**
   * Constructs a new instance of FIOWallet.
   * @param {String} appId The application ID.
   * @param {Object} user The user object which includes email.
   * @param {String} env The environment, either "DEVELOPMENT" or "PRODUCTION". Optional, defaults to "PRODUCTION".
   */
  constructor(
    private appId: string,
    private user: { email: string },
    private env: "PRODUCTION" | "DEVELOPMENT" = "PRODUCTION"
  ) {
    if (!this.appId || typeof this.appId !== "string") {
      throw new Error("App ID must be a non-empty string.");
    }

    if (!["PRODUCTION", "DEVELOPMENT"].includes(env)) {
      throw new Error(
        'Environment must be either "PRODUCTION" or "DEVELOPMENT".'
      );
    }
    this.sdk = new MetaKeep({
      appId: this.appId || "",
      user: this.user,
    });
    this.fioBaseUrl =
      this.env === "DEVELOPMENT"
        ? "https://fiotestnet.blockpane.com/v1"
        : "https://fio.blockpane.com/v1";
      
    
  }

  /**
   * Maps a public address to a FIO address.
   * @param {String} fioHandle The FIO handle.
   * @param {PublicAddress[]} publicAddresses An array of objects representing public addresses which should not exceed length of 5.
   *                      Each object should have the properties: chain_code, token_code, and public_address.
   * @returns {Promise<any>} A Promise that resolves with the mapping result.
   * @throws {Error} If more than 5 public addresses are provided.
   */
  public async mapHandle(
    fioHandle: string,
    publicAddresses: PublicAddress[]
  ): Promise<any> {
    if (publicAddresses.length > 5) {
      throw new Error("Only 5 public addresses are allowed.");
    }
    try {
      // Get the Metakeep wallet
      const wallet = await this.sdk.getWallet();

      // Convert the EOS public key to FIO public key
      const fioPubKey = EOSPubKeyToFIOPubKey(wallet.wallet.eosAddress);

      const actionData: ActionData = {
        fio_address: fioHandle,
        public_addresses: publicAddresses,
        max_fee: 10000000000000,
        tpid: "",
        actor: Fio.accountHash(fioPubKey),
      };

      // Create the raw transaction
      const { rawTx, serializedActionData, chainId } = await createRawTx({
        publicKey: fioPubKey,
        actionData: actionData,
        account: FIO_ADDRESS_ACCOUNT,
        action: ADD_ADDRESS_ACTION,
        fioBaseUrl: this.fioBaseUrl,
      });

      const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
      rawTx.actions[0].data = serializedActionData;

      // Sign the transaction using the Metakeep SDK.
      const response = await this.sdk.signTransaction(
        { rawTransaction: rawTx, extraSigningData: { chainId: chainId } },
        `Map FIO handle "${fioHandle}"`
      );
      const signature = response.signature;

      // Broadcast the transaction to the FIO chain nodes.
      const broadcastResponse = await broadcastTx({
        rawTx: rawTxCopy,
        chainId,
        account: FIO_ADDRESS_ACCOUNT,
        signature: signature,
        fioBaseUrl: this.fioBaseUrl,
      });
      return broadcastResponse;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { FIOWallet };
