## NFT - Collection Creation, Token Mint, And P2P Transfer End to End Tutorial.

This directory contains a sample project that you can use as a starting point for using the NFT Rest APIs by MetaKeep.

This Project is intended to be used with the [NFT Deployment and Token Mint Tutorial Series](https://docs.metakeep.xyz/docs/create-your-first-nft-collection-and-mint-tokens), but you should also be able to follow by reading this README.

## Directory Structure

The project is organized as follows:

- [scripts](./scripts): Contains the scripts to deploy a new NFT collection, mint tokens, lock and unlock tokens.
- [backend](./backend): Contains the backend code for server to generate consent token for P2P NFT transfer.
- [frontend](./frontend): Contains the frontend code and server for the P2P NFT transfer.

## Quick start

The first thing, you need to do is clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

### Create a new NFT collection and mint tokens

Go to the repository's `nfts/scripts` folder and run this to create a NFT collection and mint token:

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

### Get the List of your NFT tokens

Once you have minted the tokens to your wallet or the developer wallet, you follow the given steps below to get the complete list of NFTs you own.

Step 1 : Start the Backend Server by running `npm run start` in `nfts/backend` directory.

Step 2 : Open a new terminal window, and go to `nfts/frontend` directory, and run `npm run start`.

Step 3 : Once the webpage is open in your browser, you can click on the `Get NFT List`.

Step 4 : Enter your email Id in the form and click `List NFT`. It will show a complete list of your NFTs.

**_Note : _** In case you dont have the NFTs, it will alert with error, `No NFTs found for this email`.

### P2P NFT Transfer

**Note**: Ensure that you have created the collection and minted the token that you want to transfer by following the [steps above](#create-a-new-nft-collection-and-mint-tokens).

First start the backend server to generate the consent token. Go to the repository's `nfts/backend` folder and run:

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

This will open the frontend application on the default browser of your system. Enter the `Token ID`, `From email`, and `To email`. A consent token will be generated and the frontend will ask the user for the approval to transfer the token. Once the user approves the transfer, the token will be transferred to the `to email id`.

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
