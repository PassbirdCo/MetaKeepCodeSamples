# MetaKeep Lambda - Import SushiSwapRouter contract and Swap Matic tokens for USDC

This repository contains the code that demonstrates how you can import any popular smart contract like SushiSwap to MetaKeep lambda,
and invoke any of its methods.

This project is intended to be used with the
[MetaKeep Lambda Business Wallet Token Swap](https://docs.metakeep.xyz/docs/lambda-business-wallet-token-swap), but you should be
able to follow it by yourself by reading the README and exploring its `scripts` directories.

## Directory Structure

The project is organized as follows:

- [scripts](./scripts): The scripts to import already deployed smart contract and invoke its functions.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Once you have cloned the repository, you must fund your MetaKeep Business Wallet with Polygon mainnet MATIC tokens that you can buy from any popular exchange for Mainnet.

Once you have funded the business wallet, on a new terminal,
go to the repository's `lambda/business-wallet/token-swap/scripts` folder and update the `.env` file with the API key for the Polygon Mainnet network.

Then, you can run the following commands to import the contract and swap MATIC for USDC.

```sh
npm run importContract
npm run swapMaticForUSDC
```

This will import the SushiSwap V2 contract and also swap the MATIC tokens for USDC

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdainvoke) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
