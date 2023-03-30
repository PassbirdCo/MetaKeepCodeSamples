## Solana - Developer and End User signing transaction using MetaKeep SDK tutorial.

This directory contains a sample project that you can use as a starting point for using the Signing Apis for Solana chain in MetaKeep.

This Project is intended to be used with the [Transaction Signing using SDK](), but you should also be able to follow by reading this README.

## Directory Structure

The project is organized as follows:

- [scripts](./scripts): Contains the script to transfer SOL tokens from developer wallet to any wallet.
- [frontend](./frontend): Contains the frontend code to transfer tokens from end User wallet to any wallet.

## Quick start

The first thing, you need to do is clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

### Send to tokens from developer wallet

Go to the repository's `solana/scripts` folder and run this script to sign transaction from developer wallet and send on chain:

```sh
npm install
npm run transferSol
```

You will get the transaction hash after successfully the transaction is signed and sent Onchain.


### Start frontend server

Now we will start the frontend servers to sign transaction from end user wallet and send it on chain.


start the frontend server. Open a second terminal session and go to the repository's `solana/frontend/token-transfer-tutorial` folder and run

```sh
npm install
npm run start
```

This will open the frontend application on the default browser of your system.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/nft-101).

For a complete introduction to Sign APIs by MetaKeep, refer to [this guide](https://docs.metakeep.xyz/reference/v2apptransactionsign).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**