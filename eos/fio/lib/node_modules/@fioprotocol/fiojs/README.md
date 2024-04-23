# FIOJS Library
The Foundation for Interwallet Operability (FIO) is a consortium of leading blockchain wallets, exchanges and payments providers that seeks to accelerate blockchain adoption by reducing the risk, complexity, and inconvenience of sending and receiving cryptoassets.

For information on FIO, visit the [FIO website](https://fio.foundation).

For information on the FIO Chain, API, and SDKs visit the [FIO Protocol Developer Hub](https://developers.fioprotocol.io).

# Technology
The FIOJS Library is built using tsc, to generate the JavaScript files.  FIOJS is a utility/helper sdk used by the TypeScript SDK.  This utility library provides encryption, packing and signing capabilities.  Use the TypeScript SDK for FIO API support and private/public key creation.

# Version 
Visit the [FIO Protocol Developer Hub](https://developers.fioprotocol.io) to get information on FIO SDK versions. Only use an SDK that has a major version number that matches the current FIO Protocol blockchain major version number (e.g. 1.x.x).

# Installing FIOJS Library, using npm:
## The NPM Version is here:
    @fioprotocol/fiojs

# Building The FIOJS Library, manually
#### Building FIOJS, manually
Navigate to the "fiojs" folder, run npm to install its dependencies, then run tsc to compile. 
    
    cd fiojs
    npm install
    tsc
    npm test (if you would like to run the unit tests)

### Errors with compiling the SDKs
#### Unable to find tsc
Make sure to install typescript by running, this command in terminal:
    
    sudo npm install -g typescript

# Using the SDK

# Import if installing manually
const { Fio, Ecc } = require('fiojs');

# Import if using NPM package manager
const { Fio, Ecc } = require('@fioprotocol/fiojs');

# Errors Installing?
if you don’t have tsc, install it, by navigating to terminal:
npm install -g typescript

// Include textDecoder and textEncoder when using in Node, React Native, IE11 or Edge Browsers.
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
const { TextEncoder, TextDecoder } = require('text-encoding');          // React Native, IE11, and Edge Browsers only

# How to Test
The mock tests run under `npm run test`

# prepareTransaction
Client-side serialization and signing.  It is recommended that the FIO TypeScript SDK is used for FIO API calls.  But, instead, if you plan to use external RPC code. This is example RPC code, for use outside of the `Fio` JS Library instance:

info = await rpc.get_info();
blockInfo = await rpc.get_block(info.last_irreversible_block_num);
currentDate = new Date();
timePlusTen = currentDate.getTime() + 10000;
timeInISOString = (new Date(timePlusTen)).toISOString();
expiration = timeInISOString.substr(0, timeInISOString.length - 1);

// hash the public key of the payer/sender
const actorAccountHash = Fio.accountHash('FIO7bxrQUTbQ4mqcoefhWPz1aFieN4fA9RQAiozRz7FrUChHZ7Rb8');
expect(accountHash).toEqual('5kmx4qbqlpld');

// sending 1 FIO token using the trnsfiopubkey ACTION (1 FIO token = 1,000,000,000 SUFs)
transaction = {
    expiration,
    ref_block_num: blockInfo.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [{
        account: 'fio.token',
        name: 'trnsfiopubky',
        authorization: [{
            actor: actorAccountHash,
            permission: 'active',
        }],
        data: {
            payeePublicKey: 'FIO5VE6Dgy9FUmd1mFotXwF88HkQN1KysCWLPqpVnDMjRvGRi1YrM',
            amount: '1000000000',
            maxFee: 200000000,
            technologyProviderId: ''
        },
    }]
};

abiMap = new Map()
tokenRawAbi = await rpc.get_raw_abi('fio.token')
abiMap.set('fio.token', tokenRawAbi)

tx = await Fio.prepareTransaction({transaction, chainId, privateKeys, abiMap,
textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});

pushResult = await fetch(httpEndpoint + '/v1/chain/push_transaction', {
    body: JSON.stringify(tx),
    method: 'POST',
});

json = await pushResult.json()
if (json.processed && json.processed.except) {
    throw new RpcError(json);
}

expect(Object.keys(json)).toContain('transaction_id');

# accountHash
Hashes public key to an on-chain Fio account name.

const accountHash = Fio.accountHash('FIO7bxrQUTbQ4mqcoefhWPz1aFieN4fA9RQAiozRz7FrUChHZ7Rb8');
expect(accountHash).toEqual('5kmx4qbqlpld');

# createSharedCipher
The shared cipher class contains a secret used to encrypt and decrypt messages.  For example, Alice sends a new_funds_request to Bob.  In the `new_funds_request` there is a `content` field.  The `content` field is encrypted by Alice and decrypted by Bob.

newFundsContent = {
    payee_public_address: 'purse@alice',
    amount: '1.75',
    chain_code: 'FIO',
    token_code: 'FIO',
    memo: null,
    hash: null,
    offline_url: null
}

privateKeyAlice = '5J9bWm2ThenDm3tjvmUgHtWCVMUdjRR1pxnRtnJjvKA4b2ut5WK';
publicKeyAlice = 'FIO7zsqi7QUAjTAdyynd6DVe8uv4K8gCTRHnAoMN9w9CA1xLCTDVv';
privateKeyBob = '5JoQtsKQuH8hC9MyvfJAqo6qmKLm8ePYNucs7tPu2YxG12trzBt';
publicKeyBob = 'FIO5VE6Dgy9FUmd1mFotXwF88HkQN1KysCWLPqpVnDMjRvGRi1YrM';

cipherAlice = Fio.createSharedCipher({privateKey: privateKeyAlice, publicKey: publicKeyBob, textEncoder: new TextEncoder(), textDecoder: new TextDecoder()});
cipherAliceHex = cipherAlice.encrypt('new_funds_content', newFundsContent);

// Alice sends cipherAliceHex to Bob via new_funds_request
cipherBob = Fio.createSharedCipher({privateKey: privateKeyBob, publicKey: publicKeyAlice, textEncoder: new TextEncoder(), textDecoder: new TextDecoder()});
newFundsContentBob = cipherBob.decrypt('new_funds_content', cipherAliceHex);
expect(newFundsContentBob).toEqual(newFundsContent);

See `src/encryption-fio.abi.json` for other message types like `new_funds_content`.

# Message Encryption
See `docs/message_encryption.md`

## Version 1.0.1
Bug Fix.  Fallback for ripemd160 in Hashing Algorithms.  Git Commit reference: 2d565b32888ad748e3d64ba04252aae97a6e031a

## Version 1.0.0
No changes.  Just versioning.

## Version 0.9.2
Updated Documentation.
