import { ActionData } from ".";
interface CreateRawTxParams {
    publicKey: string;
    actionData: ActionData;
    account: string;
    action: string;
}
interface BroadcastTransactionParams {
    rawTx: any;
    chainId: string;
    account: string;
    signature: string;
}
interface PushTransactionResponse {
    transaction_id: string;
    processed: {
        receipt: {
            status: string;
            cpu_usage_us: number;
            net_usage_words: number;
        };
    };
}
export declare const createRawTx: ({ publicKey, actionData, account, action, }: CreateRawTxParams) => Promise<{
    rawTx: any;
    serializedActionData: string;
    chainId: string;
}>;
export declare const broadcastTx: ({ rawTx, chainId, account, signature, }: BroadcastTransactionParams) => Promise<PushTransactionResponse>;
export declare const EOSPubKeyToFIOPubKey: (eosPubKey: string) => string;
export {};
