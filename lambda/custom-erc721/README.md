# MetaKeep Lambda - Custom ERC721

MetaKeep NFT APIs provide limitless possibilities to support your NFT use case. If you have a unique NFT use case not supported by MetaKeep NFT APIs, you can write your own NFT(ERC721) contract and run it on MetaKeep's Lambda infrastructure. 

This repository contains a custom ERC721 smart contract that runs on MetaKeep's Lambda Infrastructure.
The custom contract only allows minting to whitelisted users and will only mint at most one token to a user.

This project is intended to be used with the
[MetaKeep Lambda Custom ERC721 Tutorial ](https://docs.metakeep.xyz/docs/custom-erc721), but you should be able to follow it by yourself by reading the README and exploring its `smart-contracts` and `scripts` directories.

## Directory Structure

The project is organized as follows:

- [smart-contracts](./smart-contracts/): Contains the custom ERC721 contract.
- [scripts](./scripts): Contains the script to deploy the custom ERC721 contract, whitelist users, and mint NFTs to users.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Then, on a new terminal, go to the repository's `lambda/custom-erc721/smart-contracts` directory and run the following command to compile your contract:

```sh
npm install
npx hardhat compile
```

Run the following command to test the contract:

```sh
npx hardhat test
```

## Create your Custom ERC721 token

After you have compiled and tested the contract, go to the repository's `lambda/custom-erc721/scripts` directory and run the following command to deploy your contract:


```sh
npm install
npm run create
```

After the successful call, you will get the custom ERC721 lambda address in the output. Paste it in the `env` file against `LAMBDA_ADDRESS`

## Whitelist User and Mint NFT token.

Update the `USER_EMAIL` of the user in the `.env` file who will be getting the minted NFT.

Now run the following command to whitelist the user and mint an NFT:

```sh
npm run invoke
```

After the successful invocation, you would have whitelisted the user and minted the token.

## User Guide

You can find detailed instructions on using MetaKeep Lambda and tips in [the documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project or MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/).

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
