import { MetaKeep } from "metakeep";
import { EOSPubKeyToFIOPubKey, createRawTx, broadcastTx } from "./utils";
import { Fio } from "@fioprotocol/fiojs";

/**
 * Represents the action data required for mapping a public address to a FIO address.
 */
export interface ActionData {
  fio_address: string;
  public_addresses: {
    chain_code: string;
    token_code: string;
    public_address: string;
  }[];
  max_fee: number;
  tpid: string;
  actor: string;
}

/**
 * Represents the parameters required for mapping a public address to a FIO address.
 */
interface MapHandleParams {
  publicAddress: string;
  chainCode: string;
  tokenCode: string;
}

/**
 * Represents a FIO Wallet.
 */
class FioWallet {
  private sdk: MetaKeep;
  private fioPubKey: string;
  private fioAddress: string;

  /**
   * Constructs a new instance of FioWallet.
   * @param appId The application ID.
   * @param email The user's email address.
   */
  constructor(private appId: string, private email: string) {
    this.appId = appId;
    this.email = email;
    this.sdk = new MetaKeep({
      appId: this.appId || "",
      user: { email: this.email },
    });
    this.fioPubKey = null;
    this.fioAddress = null;
  }

  /**
   * Generates a FIO address from an email.
   * @param email The email address.
   * @returns The generated FIO address.
   */
  private getFioAddress(email: string): string {
    return email.replace(/[^a-zA-Z0-9]/g, "") + "@fiotestnet";
  }

  /**
   * Maps a public address to a FIO address.
   * @param publicAddress The public address to be mapped.
   * @param chainCode The chain code.
   * @param tokenCode The token code.
   */
  public async mapHandle({
    publicAddress,
    chainCode,
    tokenCode,
  }: MapHandleParams): Promise<void> {
    try {
      const wallet = await this.sdk.getWallet();
      this.fioPubKey = EOSPubKeyToFIOPubKey(wallet.wallet.eosAddress);
      this.fioAddress = this.getFioAddress(this.email);
      const actionData: ActionData = {
        fio_address: this.fioAddress,
        public_addresses: [
          {
            chain_code: chainCode,
            token_code: tokenCode,
            public_address: publicAddress,
          },
        ],
        max_fee: 10000000000000,
        tpid: "",
        actor: Fio.accountHash(this.fioPubKey),
      };

      const { rawTx, serializedActionData, chainId } = await createRawTx({
        publicKey: this.fioPubKey,
        actionData: actionData,
        account: "fio.address",
        action: "addaddress",
      });

      const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
      rawTx.actions[0].data = serializedActionData;

      const response = await this.sdk.signTransaction(
        { rawTransaction: rawTx, extraSigningData: { chainId: chainId } },
        `register FIO Address "${this.fioAddress}"`
      );
      const signature = response.signature;
      const broadcastResponse = await broadcastTx({
        rawTx: rawTxCopy,
        chainId,
        account: "fio.address",
        signature: signature,
      });

      if (broadcastResponse.transaction_id) {
        console.log("Map successful!");
      } else {
        console.error("Map failed!");
      }
      console.log("Transaction broadcastResponse: ", broadcastResponse);
    } catch (error) {
      console.error(error.status ?? error.message);
    }
  }
}

export { FioWallet };
