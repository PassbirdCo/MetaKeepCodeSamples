# MetaKeep Lambda - Custom ERC1155

MetaKeep NFT and Coin APIs provide limitless possibilities to support your blockchain use case. If you have a special requirement not supported by MetaKeep APIs, you can write your own [ERC1155](https://eips.ethereum.org/EIPS/eip-1155) contract and run it on MetaKeep's Lambda infrastructure. [ERC1155](https://eips.ethereum.org/EIPS/eip-1155) is a multi-token standard that may include any combination of fungible tokens, non-fungible tokens or other configurations (e.g. semi-fungible tokens).

This directory contains a Custom ERC1155 Application that you can use as the starting point for running ERC1155 on MetaKeep's Lambda Infrastructure.

This project is intended to be used with the
[MetaKeep Lambda Custom ERC1155 Tutorial ](https://docs.metakeep.xyz/docs/custom-erc1155), but you should be able to follow it by yourself by reading the README and exploring its `smart-contracts` and `scripts` directories.

## Directory Structure

The project is organized as follows:

- [smart-contracts](./smart-contracts/): Contains the custom ERC1155 contract.
- [scripts](./scripts) : Contains the script to deploy the custom ERC1155 contract and issue different tokens(ERC721 and ERC20) to users.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Then, on a new terminal, go to the repository's `lambda/custom-erc1155/smart-contracts` directory and run the following command to compile your contract:

```sh
npm install
npx hardhat compile
```

Run the following command to test the contract:

```sh
npx hardhat test
```

## Create your Custom ERC1155 contract

After you have compiled and tested the contract, go to the repository's `lambda/custom-erc1155/scripts` directory and run the following command to deploy your contract:

```sh
npm install
npm run create
```

After the successful call, you will get the custom ERC1155 lambda address in the output. Paste it in the `.env` file against `LAMBDA_ADDRESS`

## Mint tokens to the user.

Update the `USER_EMAIL` of the user in the `.env` file who will be getting the minted tokens.

Now run the following command to mint the tokens:

```sh
npm run invoke
```

After successful Invocation, you would have minted both ERC721 and ERC20 token types to the users.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/).

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
