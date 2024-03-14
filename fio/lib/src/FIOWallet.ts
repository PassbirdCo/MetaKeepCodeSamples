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
  appId: string;
  email: string;
  publicAddress: string;
  chainCode: string;
  tokenCode: string;
}

/**
 * Represents the parameters required for signing a transaction.
 */
interface SignTransactionParams {
  rawTx: any;
  chainId: string;
  fioAddress: string;
}

/**
 * Represents the response of signing a transaction.
 */
interface SignResponse {
  signature: string;
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
    this.initialize();
  }

  /**
   * Initializes the FioWallet by retrieving necessary data.
   */
  private async initialize(): Promise<void> {
    this.sdk = new MetaKeep({
      appId: this.appId || "",
      user: { email: this.email },
    });
    const wallet = await this.sdk.getWallet();
    this.fioPubKey = EOSPubKeyToFIOPubKey(wallet.wallet.eosAddress);
    this.fioAddress = this.getFioAddress(this.email);
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
   * Signs a transaction.
   * @param rawTx The raw transaction data.
   * @param chainId The chain ID.
   * @param fioAddress The FIO address.
   * @returns The signature response.
   */
  private async signTransaction({
    rawTx,
    chainId,
    fioAddress,
  }: SignTransactionParams): Promise<SignResponse> {
    const response = await this.sdk.signTransaction(
      { rawTransaction: rawTx, extraSigningData: { chainId: chainId } },
      `register FIO Address "${fioAddress}"`
    );
    return response;
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

      const response = await this.signTransaction({
        rawTx,
        chainId,
        fioAddress: this.fioAddress,
      });
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
