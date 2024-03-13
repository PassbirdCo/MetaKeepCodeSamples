import { MetaKeep } from "metakeep";
import { EOSPubKeyToFIOPubKey, createRawTx, broadcastTx } from "./utils";
import { Fio } from "@fioprotocol/fiojs";

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

interface SignTransactionParams {
  sdk: MetaKeep;
  rawTx: any;
  chainId: string;
  fioAddress: string;
}

interface SignResponse {
  signature: string;
}

const getFioAddress = (email: string): string =>
  email.replace(/[^a-zA-Z0-9]/g, "") + "@fiotestnet";

const signTransaction = async ({
  sdk,
  rawTx,
  chainId,
  fioAddress,
}: SignTransactionParams): Promise<SignResponse> => {
  const response = await sdk.signTransaction(
    { rawTransaction: rawTx, extraSigningData: { chainId: chainId } },
    `register FIO Address "${fioAddress}"`
  );
  return response;
};

export async function mapHandle({
  appId,
  email,
  publicAddress,
  chainCode,
  tokenCode,
}: MapHandleParams): Promise<void> {
  try {
    const sdk = new MetaKeep({
      appId: appId || "",
      user: { email },
    });

    const wallet = await sdk.getWallet();
    const fioPubKey = EOSPubKeyToFIOPubKey(wallet.wallet.eosAddress);
    const fioAddress = getFioAddress(email);
    const actionData = {
      fio_address: fioAddress,
      public_addresses: [
        {
          chain_code: chainCode,
          token_code: tokenCode,
          public_address: publicAddress,
        },
      ],
      max_fee: 10000000000000,
      tpid: "",
      actor: Fio.accountHash(fioPubKey),
    };

    const { rawTx, serializedActionData, chainId } = await createRawTx({
      publicKey: fioPubKey,
      actionData: actionData,
      account: "fio.address",
      action: "addaddress",
    });

    const rawTxCopy = JSON.parse(JSON.stringify(rawTx));
    rawTx.actions[0].data = serializedActionData;

    const response = await signTransaction({ sdk, rawTx, chainId, fioAddress });
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
