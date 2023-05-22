// Utils File to Register Address in FIO Chain
const { Fio } = require("@fioprotocol/fiojs");
const {
  serializeActionData,
} = require("@fioprotocol/fiojs/dist/chain-serialize");
const { base64ToBinary } = require("@fioprotocol/fiojs/dist/chain-numeric");
const { Api } = require("@fioprotocol/fiojs/dist/chain-api");

const {
  Transactions,
} = require("@fioprotocol/fiosdk/lib/transactions/Transactions");

export const createRegisterAddressTx = async (
    publicKey,
    fio_address,
    account,
    action,
) => {

    const chainData = await getChainData();
    // Create the action data object

    Transactions.FioProvider = {
        accountHash: Fio.accountHash,
    };
    console.log('publicKey', publicKey)
    const actionData = {
        fio_address: fio_address,
        owner_fio_public_key: publicKey,
        max_fee: 40000000000,
        tpid: 'rewards@wallet',
        actor: Fio.accountHash(publicKey),
    }

    console.log('actionData', actionData)

    const serializedActionData = await createSerializeActionData(
        account,
        action,
        actionData,
        chainData.chain_id,
    )
    console.log('serializedActionData', serializedActionData)

    const {fioTokenAbi} = await getAbiProvider(account);

    Transactions.abiMap.set(fioTokenAbi.account_name, fioTokenAbi)

    const transaction = new Transactions()
    const rawTx = await transaction.createRawTransaction(
        {
            action: action,
            account: account,
            data: actionData,
            chainData: chainData,
            publicKey: publicKey,
        }
    )

    const { serializedContextFreeData, serializedTransaction } = await transaction.serialize(
        {
            chainId: chainData.chain_id,
            transaction: rawTx,
        }
    )

    return {
        serializedTransaction,
        serializedContextFreeData,
        rawTx,
        serializedActionData,
        chain_id: chainData.chain_id,
    }

}

const createSerializeActionData = async (
    account,
    actionName,
    actionData,
    chainId,
) => {

    const {abiProvider} = await getAbiProvider(account);

    const fioApi = new Api({
        chainId: chainId,
        abiProvider: abiProvider,
    });

    const contract = await fioApi.getContract(account);

    let serializedActionData =  serializeActionData(
        contract,
        account,
        actionName,
        actionData,
    );

    return serializedActionData

}


const getAbiProvider = async (account) => {
    const fioTokenAbi = await fetch(
        "https://fiotestnet.blockpane.com/v1/chain/get_raw_abi",
        {
          method: "POST",
          body: JSON.stringify({
            account_name: account,
          }),
        }
      ).then((res) => res.json());

    // Create the abi provider
    const abiMap = new Map();
    abiMap.set(account, fioTokenAbi);

    const abiProvider = {
        getRawAbi: async function() {
            const rawAbi = abiMap.get(account);
            if (!rawAbi) throw new Error("Missing abi for " + account);
            const abi = base64ToBinary(rawAbi.abi);
            const binaryAbi = {
                accountName: rawAbi.account_name,
                abi: abi,
            };
            return binaryAbi;
        }
    };

    return {fioTokenAbi, abiProvider}
}


const getChainData = async () => {
    // Get the blockchain data

    const blockchainData = await fetch(
        "https://fiotestnet.blockpane.com/v1/chain/get_info",
        {
          method: "POST",
        }
      ).then((res) => res.json());

    // Get the last irreversible block number
      const blockData = await fetch(
        "https://fiotestnet.blockpane.com/v1/chain/get_block",
        {
          method: "POST",
          body: JSON.stringify({
            block_num_or_id: blockchainData.last_irreversible_block_num,
          }),
        }
      ).then((res) => res.json());

    // Create the chain Data object
    const chainData = {
        chain_id : blockchainData.chain_id,
        expiration: new Date(new Date().getTime() + 60 * 1000).toISOString().split('.')[0],
        ref_block_num: blockData.block_num & 0xffff,
        ref_block_prefix: blockData.ref_block_prefix,
    }

    return chainData
}

export const broadcastTx = async (rawTx, chain_id, account , signature) => {

    const {fioTokenAbi} = await getAbiProvider(account);

    Transactions.abiMap.set(fioTokenAbi.account_name, fioTokenAbi)

    const transaction = new Transactions()
    //rawTx.signatures = [signature]
    const { serializedContextFreeData, serializedTransaction } = await transaction.serialize(
        {
            chainId: chain_id,
            transaction: rawTx,
        }
    )
    const pushTransactionArgs = {
        signatures: [signature],
        packed_trx: Buffer.from(serializedTransaction).toString("hex"),
        packed_context_free_data: serializedContextFreeData
          ? Buffer.from(serializedContextFreeData).toString("hex")
          : "",
        compression: 0,
      };

      // Push transaction to the network
      const pushTransactionResponse = await fetch(
        "https://fiotestnet.blockpane.com/v1/chain/push_transaction",
        {
          method: "POST",
          body: JSON.stringify(pushTransactionArgs),
        }
      );

        const pushTransactionJson = await pushTransactionResponse.json();

        return pushTransactionJson

}