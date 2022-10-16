# MetaKeep Lambda - Custom ERC721

This repository contains a Custom ERC721 Application that you can use as the starting point
for using MetaKeep's Lambda Infrastructure.

In the custom nft smart-contract, we have implemented a functionality, where developers can whitelist specific users and mint tokens to them only.

This project is intended to be used with the
[MetaKeep Lambda Creation and Invocation Tutorial Series](https://docs.metakeep.xyz/docs/custom-erc721), but you should be
able to follow it by yourself by reading the README and exploring its
`contracts` and `scripts` directories.

## Directory Structure

The project is organized as follows:

- [contracts](./smart-contracts/contracts): Contains the Smart Contract for Custom ERC721 Tokens.
- [scripts](./scripts) : Contains the script to deploy custom ERC721 token and whitelist and mint NFT token to the user.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Then, on a new terminal, go to the repository's `lambda/custom-erc721/smart-contracts` directory and run this to
compile your smart contract:

```sh
npm install
npx hardhat compile
```

If you want to test smart contract run the following command.

```sh
npx hardhat test
```

## Create your Custom ERC721 token

After you have compiled and tested the contracts, open a new terminal window and run the following command in the `lambda/custom-erc721/scripts` directory.

_Install the `node_modules` if you have not by running the `npm install` command._

The custom NFT contract in the `custom-erc721/smart-contracts` directory `CustomERC721.sol` has a additional feature, which allows developers to whitelist users and mint NFTs to them only.

To deploy the custom NFT contract. Run to following command to deploy to NFT using `app/lambda/create` API.

```sh
npm run create
```

After the successful call to the script you will get the custom NFT contract Address. Paste it in the `env` file against `LAMBDA_ADDRESS`

## Whitelist User and Mint NFT token to it.

After the sucessful deployment of the Custom NFT contract, you need to add the `USER_EMAIL` in the `.env` file.

Now you can run the script `whitelistAndMint.js` using the following command.

```sh
npm run invoke
```

After successful Invocation, you would have whitelisted the user and minted the token.

In the upcoming tutorial we will discuss, some more good examples leveraging different MetaKeep NFT APIs

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
