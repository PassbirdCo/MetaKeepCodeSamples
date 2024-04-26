import { MetaKeep } from "metakeep";
import { Fio } from "@fioprotocol/fiojs";

import {
  EOSPubKeyToFIOPubKey,
  createRawTx,
  broadcastTx,
  PushTransactionResponse,
  ADD_ADDRESS_ACTION,
  FIO_ADDRESS_ACCOUNT,
  ActionData,
  PublicAddress,
  Environment,
} from "./utils";

/**
 * Represents the available options to the FIOWallet constructor
 */
interface FIOWalletOptions {
  appId: string;
  user: { email: string };
  env?: Environment;
}

/**
 * Represents a FIO Wallet.
 */
class FIOWallet {
  private sdk: MetaKeep;
  private fioBaseUrl: string;

  /**
   * Constructs a new instance of FIOWallet.
   * @param {FIOWalletOptions} options The options object which includes appId, user, and environment.
   */
  constructor(private options: FIOWalletOptions) {
    if (!this.options.appId || typeof this.options.appId !== "string") {
      throw new Error("App ID must be a non-empty string.");
    }

    if (!this.options.env) {
      this.options.env = Environment.PRODUCTION;
    }

    if (
      ![Environment.PRODUCTION, Environment.DEVELOPMENT].includes(
        this.options.env
      )
    ) {
      throw new Error(
        'Environment must be either "PRODUCTION" or "DEVELOPMENT".'
      );
    }

    // Initialize the Metakeep SDK
    this.sdk = new MetaKeep({
      appId: this.options.appId || "",
      user: this.options.user,
    });

    this.fioBaseUrl =
      this.options.env === Environment.DEVELOPMENT
        ? "https://fiotestnet.blockpane.com/v1"
        : "https://fio.blockpane.com/v1";
  }

  /**
   * Maps a public address to a FIO handle.
   * @param {String} fioHandle The FIO handle.
   * @param {PublicAddress[]} publicAddresses An array of objects representing public addresses which should not exceed length of 5.
   *                      Each object should have the properties: chain_code, token_code, and public_address.
   * @param {String} reason An optional reason for mapping the public address that will be displayed to the user at the time of signing.
   * If not provided, a default message will be displayed.
   * @returns {Promise<any>} A Promise that resolves with the mapping result.
   * @throws {Error} If more than 5 public addresses are provided.
   */
  public async mapHandle(
    fioHandle: string,
    publicAddresses: PublicAddress[],
    reason?: string
  ): Promise<PushTransactionResponse> {
    if (publicAddresses.length > 5) {
      throw new Error(
        "Only maximum of 5 public addresses are allowed at a time."
      );
    }

    // Get the user's wallet from the Metakeep SDK
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

    // Create a copy of the raw transaction to update action data
    // with serialized action data.
    const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
    rawTx.actions[0].data = serializedActionData;

    // Sign the transaction using the Metakeep SDK.
    const response = await this.sdk.signTransaction(
      { rawTransaction: rawTx, extraSigningData: { chainId: chainId } },
      reason ||
        `map your FIO handle "${fioHandle}" to ${publicAddresses.length} public address(es).`
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
  }
}

export { FIOWallet };
