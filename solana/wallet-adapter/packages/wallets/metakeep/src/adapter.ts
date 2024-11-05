import type { TransactionOrVersionedTransaction, WalletName } from '@solana/wallet-adapter-base';
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
} from '@solana/wallet-adapter-base';
import { Transaction, TransactionVersion, VersionedTransaction } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { MetaKeep } from 'metakeep';

interface MetaKeepWallet {
    isMetaKeepWallet?: boolean;
    getAccount(): Promise<String>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
}


export interface MetaKeepWalletAdapterConfig {
    appId?: string;
    network?: string;
    endpoint?: string;
    user?: {
        email: string;
    };
}

export const MetaKeepWalletName = 'MetaKeep' as WalletName<'MetaKeep'>;


export class MetaKeepWalletAdapter extends BaseMessageSignerWalletAdapter {

    name = MetaKeepWalletName;
    url = 'https://metakeep.xyz';
    icon = 'https://cdn-icons-png.flaticon.com/512/2571/2571359.png';
    private _metaKeepInstance: MetaKeep | null | undefined;
    private _publicKey: PublicKey | null;
    private _connecting: boolean;
    private _config: MetaKeepWalletAdapterConfig | undefined;
    private _readyState: WalletReadyState =
        typeof window === 'undefined' || typeof document === 'undefined'
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
        try {
            if (this.connected || this.connecting) return;
            if (this._readyState !== WalletReadyState.Loadable) throw new WalletNotReadyError();

            this._connecting = true;

            try {
                this._metaKeepInstance = new MetaKeep({
                    appId: this.config?.appId || "",
                    chainId: 901,
                    rpcNodeUrls: {
                        901: this.config?.endpoint || "",
                    },
                    user: this.config?.user || { email: "" },

                })
            } catch (error: any) {
                throw new WalletLoadError(error);
            }

            let account: any;

            try {
                account = await this._metaKeepInstance.getWallet();
                console.log(account);
            } catch (error: any) {
                console.log(error);
                throw new WalletAccountError(error);
            }

            let publicKey: PublicKey;
            try {
                publicKey = new PublicKey(account?.wallet.solAddress);
            } catch (error: any) {
                throw new WalletPublicKeyError(error);
            }
            this._publicKey = publicKey;
            this.emit('connect', publicKey);
        } catch (error: any) {
            this.emit('error', error);
            throw new WalletLoadError(error);
        }
        finally {
            this._connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        if (!this.connected) return;
        this._connecting = false;
        this._metaKeepInstance = null;

        this.emit('disconnect');
    }


    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        try {
            if (!this.connected) throw new WalletNotConnectedError();

            const signedMessage = await this._metaKeepInstance?.signMessage(new TextDecoder().decode(message), 'Sign Message');
            console.log(signedMessage);
            // convert hex to Uint8Array
            const signature = new Uint8Array(Buffer.from(signedMessage.signature.slice(2), 'hex'));
            return signature;
        }
        catch (error: any) {
            throw new WalletSignTransactionError(error);
        }
    }

    get supportedTransactionVersions(): ReadonlySet<TransactionVersion> {
        return new Set<TransactionVersion>(["0", "legacy"] as TransactionVersion[]);
    }

    async signTransaction<T extends TransactionOrVersionedTransaction<any>>(transaction: T): Promise<T> {
        try {
            if (!this.connected) throw new WalletNotConnectedError();

            if (isVersionedTransaction(transaction)) {
                // Handle VersionedTransaction
                const signedTransaction = await this._metaKeepInstance?.signTransaction(transaction as any, 'Sign Transaction');
                console.log(signedTransaction);
                const signedRawTransaction = signedTransaction.signedRawTransaction;
                return VersionedTransaction.deserialize(new Uint8Array(Buffer.from(signedRawTransaction.slice(2), 'hex'))) as T;
            } else {
                // Handle Transaction
                const signedTransaction = await this._metaKeepInstance?.signTransaction(transaction, 'Sign Transaction');
                console.log(signedTransaction);
                const signedRawTransaction = signedTransaction.signedRawTransaction;
                return Transaction.from(new Uint8Array(Buffer.from(signedRawTransaction.slice(2), 'hex'))) as T;
            }
        }
        catch (error: any) {
            throw new WalletSignTransactionError(error);
        }
    }
}
