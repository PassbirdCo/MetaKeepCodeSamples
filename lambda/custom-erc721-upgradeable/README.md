# MetaKeep Lambda - Custom ERC721 Upgradeable contract

MetaKeep Lambda APIs support the deployment of upgradeable smart contracts. If you are looking to implement an upgradeable smart contract, you can leverage MetaKeep's Lambda Infrastructure

This repository contains a custom ERC721 upgradeable smart contract that runs on MetaKeep's Lambda Infrastructure.
The custom contract only allows minting to whitelisted users and will only mint at most one token to a user.

This project is intended to be used with the
[MetaKeep Lambda Upgradeable Tutorial ](https://docs.metakeep.xyz/docs/lambda-upgradeable), but you should be able to follow it by yourself by reading the README and exploring its `smart-contracts` and `scripts` directories.

## Directory Structure

The project is organized as follows:

- [smart-contracts](./smart-contracts/): Contains the custom ERC721 Upgradeable contract and the proxy contract.
- [scripts](./scripts): Contains the script to deploy the custom ERC721 Upgradeable contract, proxy contract, whitelist users, and mint NFTs to users.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Then, on a new terminal, go to the repository's `lambda/custom-erc721-upgradeable/smart-contracts` directory and run the following command to compile your contract:

```sh
npm install
npx hardhat compile
```

Run the following command to test the contract:

```sh
npx hardhat test
```

## Deploy Custom ERC721 upgradeable contract

After you have compiled and tested the contract, go to the repository's `lambda/custom-erc721-upgradeable/scripts` directory and run the following command to deploy your contract:

```sh
npm install
npm run deployCustomERC721Upgradeable
```

After the successful call, you will get the custom ERC721 lambda address in the output. Paste it in the `.env` file against `CUSTOM_ERC721_UPGRADEABLE_CONTRACT_ADDRESS`

## Deploy the Proxy contract and initialize the ERC721 contract

```sh
npm run deployProxy
```

After the proxy is successfully deployed, you will get the proxy contract in the output. Paste it in the `.env` file against `CUSTOM_ERC721_PROXY_ADDRESS`

## Whitelist User and Mint NFT token.

Update the `USER_EMAIL` of the user in the `.env` file who will be getting the minted NFT.

Now run the following command to whitelist the user and mint an NFT:

```sh
npm run invoke
```

After the successful invocation, you would have whitelisted the user and minted the token.

## Upgrade the Implementation contract to new customERC721Upgradeable contract

```sh
npm run upgradeToCustomERC721UpgradeableV2
```

This will upgrade the contract code and also update the ABI by making an API call to `/v2/lambda/update`.

## User Guide

You can find detailed instructions on using MetaKeep Lambda and tips in [the documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project or MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/).

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
