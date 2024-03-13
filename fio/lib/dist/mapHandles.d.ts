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
interface MapHandleParams {
    appId: string;
    email: string;
    publicAddress: string;
    chainCode: string;
    tokenCode: string;
}
export declare function mapHandle({ appId, email, publicAddress, chainCode, tokenCode, }: MapHandleParams): Promise<void>;
export {};
