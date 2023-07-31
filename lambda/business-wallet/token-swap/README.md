# MetaKeep Lambda - Import UniswapV2Router and Swap Matic tokens for USDC

This repository contains the code that demonstrates how you can import any popular smart contract like Uniswap in Metakeep,
and Invoke any of its methods.

This project is intended to be used with the
[MetaKeep Lambda Import and Invocation Tutorial Series](https://docs.metakeep.xyz/docs/create-your-first-lambda), but you should be
able to follow it by yourself by reading the README and exploring its `scripts` directories.

## Directory Structure

The project is organized as follows:

- [scripts](./scripts): Contains the scripts to import already deployed smart contracts and invoke its functions.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Once you have cloned the repository, you need to fund your MetaKeep Business Wallet with the MATIC tokens.
You can either get it from the faucet for Mumbai Network or Buy it from any Popular exchange for Mainnet.

Once you have funded the business wallet, on a new terminal,
go to the repository's `lambda/lambda-import/scripts` folder and add the env variable values.

Finally, you can run the following commands to import contract and swap MATIC for USDC.

```sh
npm run importContract
npm run swapMaticForUSDC
```

This will import the Uniswap V2 contract and also swap the MATIC tokens for USDC

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
