## NFT - Collection Creation, Token Mint, And P2P Transfer End-to-End Tutorial.

This directory contains a sample project that you can use as a starting point for using the NFT Rest APIs by MetaKeep.

This Project is intended to be used with the [NFT Deployment and Token Mint Tutorial Series](https://docs.metakeep.xyz/docs/create-your-first-nft-collection-and-mint-tokens), but you should also be able to follow by reading this README.

## Directory Structure

The project is organized as follows:

- [scripts](./scripts): Contains the scripts to deploy a new NFT collection, mint tokens, lock and unlock tokens.
- [backend](./backend): Contains the backend code to list NFTs and P2P Transfer.
- [frontend](./frontend): Contains the frontend code to show NFTs and P2P transfer.
- [mobile](./mobile): Contains the mobile code(Android/iOS) to show NFTs and P2P transfer.

## Quick start

The first thing, you need to do is clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

### Create a new NFT collection and mint tokens

Go to the repository's `nfts/scripts` folder and run this to create an NFT collection and mint token:

```sh
npm install
npm run createCollectionAndMintToken
```

You will see the collection address and token id in the output of the script.

### Lock and Unlock Tokens

After minting a new token, you can `Lock` and `Unlock` token by running the following command:

```sh
npm run lockUnlockToken
```

### Start backend and frontend server

Now we will start the backend and frontend servers to list the NFTs and transfer them.

First, start the backend server to generate the consent token. Go to the repository's `nfts/backend` folder and run:

```sh
npm install
npm run start
```

This will start a local server at port `3001`

Now, start the frontend server. Open a second terminal session and go to the repository's `nfts/frontend` folder and run

```sh
npm install
npm run start
```

This will open the frontend application on the default browser of your system.

**Note**: Before proceeding, ensure that you have created the collection and minted the token that you want to transfer by following the [steps above](#create-a-new-nft-collection-and-mint-tokens).

### Test mobile(Android/iOS) applications

You can now test the mobile applications in the `nfts/mobile` folder. The mobile applications will use the same backend server started in the previous step.

#### Get the List of your NFT tokens.

Once you have minted the tokens to the user's wallet, enter the user's email in the frontend application and click `List NFT`.

You will see the list of NFTs owned by the user along with the NFT name, description, image, and token id.

**Note:** In case you don't have any NFTs, UI will show an error.

#### Gasless P2P NFT Transfer

In the list of NFTs, enter the email of the user to whom you want to transfer the NFT and click `Transfer`.
A consent token will be generated and the front end will ask the user for approval to transfer the token. Once the user approves the transfer, the token will be transferred to the new `email`.

For details about the consent token, refer to [Get Consent](https://docs.metakeep.xyz/reference/get-consent) guide.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/nft-101).

For a complete introduction to NFT APIs by MetaKeep, refer to [this guide](https://docs.metakeep.xyz/reference/nft-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
