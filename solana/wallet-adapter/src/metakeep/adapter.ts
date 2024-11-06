import type {
  TransactionOrVersionedTransaction,
  WalletName,
} from "@solana/wallet-adapter-base";
import {
  BaseMessageSignerWalletAdapter,
  isVersionedTransaction,
  WalletAccountError,
  WalletLoadError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletPublicKeyError,
  WalletReadyState,
  WalletSignTransactionError,
} from "@solana/wallet-adapter-base";
import {
  Transaction,
  TransactionVersion,
  VersionedTransaction,
} from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { MetaKeep } from "metakeep";

export interface MetaKeepWalletAdapterConfig {
  appId?: string;
  user?: {
    email: string;
  };
}

export const MetaKeepWalletName =
  "Use Email (or Phone)" as WalletName<"Use Email (or Phone)">;

export class MetaKeepWalletAdapter extends BaseMessageSignerWalletAdapter {
  name = MetaKeepWalletName;
  url = "https://metakeep.xyz";
  icon = "https://cdn-icons-png.flaticon.com/512/2571/2571359.png";
  private _metaKeepInstance: MetaKeep | null | undefined;
  private _publicKey: PublicKey | null;
  private _connecting: boolean;
  private _config: MetaKeepWalletAdapterConfig | undefined;
  private _readyState: WalletReadyState =
    typeof window === "undefined" || typeof document === "undefined"
      ? WalletReadyState.Unsupported
      : WalletReadyState.Loadable;

  get publicKey() {
    return this._publicKey;
  }

  get connecting() {
    return this._connecting;
  }

  get readyState() {
    return this._readyState;
  }

  get config() {
    return this._config;
  }

  get metaKeepInstance() {
    return this._metaKeepInstance;
  }

  constructor(config: MetaKeepWalletAdapterConfig = {}) {
    super();
    this._publicKey = null;
    this._connecting = false;
    this._config = config;
  }

  async connect(): Promise<void> {
    console.debug("MetaKeepWalletAdapter connecting");

    try {
      if (this.connected || this.connecting) return;
      if (this._readyState !== WalletReadyState.Loadable)
        throw new WalletNotReadyError();

      this._connecting = true;

      // Initialize MetaKeep SDK
      try {
        this._metaKeepInstance = new MetaKeep({
          appId: this.config?.appId || "",
          user: this.config?.user || { email: "" },
        });
      } catch (error: any) {
        console.error("Error initializing MetaKeep SDK", error);
        throw new WalletLoadError(error);
      }

      // Get wallet account
      let account: any;
      try {
        account = await this._metaKeepInstance.getWallet();
      } catch (error: any) {
        console.error("Error getting wallet account", error);
        throw new WalletAccountError(error);
      }

      // Read public key
      let publicKey: PublicKey;
      try {
        publicKey = new PublicKey(account?.wallet.solAddress);
      } catch (error: any) {
        console.error("Error reading public key", error);
        throw new WalletPublicKeyError(error);
      }

      this._publicKey = publicKey;
      this.emit("connect", publicKey);
    } catch (error: any) {
      this.emit("error", error);
      throw new WalletLoadError(error);
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    console.debug("MetaKeepWalletAdapter disconnecting");

    if (!this.connected) return;
    this._connecting = false;
    this._metaKeepInstance = null;
    this._publicKey = null;

    this.emit("disconnect");
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    console.debug("MetaKeepWalletAdapter signing message");

    if (!this.connected) throw new WalletNotConnectedError();

    // Sign message using MetaKeep SDK
    try {
      const signedMessage = await this._metaKeepInstance?.signMessage(
        new TextDecoder().decode(message),
        "Sign Message"
      );
      // Convert hex to Uint8Array
      const signature = new Uint8Array(
        Buffer.from(signedMessage.signature.slice(2), "hex")
      );
      return signature;
    } catch (error: any) {
      console.error("Error signing message", error);
      throw new WalletSignTransactionError(error);
    }
  }

  get supportedTransactionVersions(): ReadonlySet<TransactionVersion> {
    return new Set<TransactionVersion>(["0", "legacy"] as TransactionVersion[]);
  }

  async signTransaction<T extends TransactionOrVersionedTransaction<any>>(
    transaction: T
  ): Promise<T> {
    console.debug("MetaKeepWalletAdapter signing transaction");

    if (!this.connected) throw new WalletNotConnectedError();

    // Sign transaction using MetaKeep SDK
    try {
      if (isVersionedTransaction(transaction)) {
        // Handle VersionedTransaction
        const signedTransaction = await this._metaKeepInstance?.signTransaction(
          transaction as any,
          "Sign Transaction"
        );
        const signedRawTransaction = signedTransaction.signedRawTransaction;
        return VersionedTransaction.deserialize(
          new Uint8Array(Buffer.from(signedRawTransaction.slice(2), "hex"))
        ) as T;
      } else {
        // Handle Transaction
        const signedTransaction = await this._metaKeepInstance?.signTransaction(
          transaction,
          "Sign Transaction"
        );
        const signedRawTransaction = signedTransaction.signedRawTransaction;
        return Transaction.from(
          new Uint8Array(Buffer.from(signedRawTransaction.slice(2), "hex"))
        ) as T;
      }
    } catch (error: any) {
      console.error("Error signing transaction", error);
      throw new WalletSignTransactionError(error);
    }
  }
}
