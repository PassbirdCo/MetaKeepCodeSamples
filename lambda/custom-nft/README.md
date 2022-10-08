# MetaKeep Lambda - Custom ERC721

This repository contains a Custom ERC721 Application that you can use as the starting point
for using MetaKeep's Lambda Infrastructure.

This project is intended to be used with the
[MetaKeep Lambda Creation and Invocation Tutorial Series](https://docs.metakeep.xyz/docs/create-your-first-lambda), but you should be
able to follow it by yourself by reading the README and exploring its
`contracts` and `scripts` directories.

## Directory Structure

The project is organized as follows:

- [contracts](./contracts): Contains the Smart Contract for Custom ERC721 Tokens.
- [scripts](./scripts) : Contains the script to deploy custom ERC721 token and Mint and Burn them.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Then, on a new terminal, go to the repository's `lambda/custom-nft/contracts` directory and run this to
compile your smart contract:

```sh
npm install
npx hardhat compile
```

If you want to test smart contract run the following command.

```sh
npx hardhat test
```

## Create your Custom NFT token

After you have compiled and tested the contracts, open a new terminal window and run the following command in the `lambda/custom-nft/scripts` directory.

_Install the `node_modules` if you havent by running the `npm install` command._

```sh
npm run create
```

## Invoke Mint and Burn Methods from the Custom NFT token

Followed to the successful deployment of the custom NFT in the previous step, you can invoke the methods in the deployed contract by running the following commands.

```sh
npm run invoke
```

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
