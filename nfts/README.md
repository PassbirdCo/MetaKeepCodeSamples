## NFT Deployment - Token Mint And Transfer End to End Tutorial.

This directory contains a sample project that you can use as a starting point for using the NFT Rest API by MetaKeep.

This Project is intended to be used with the [NFT Deployment and Token Mint Tutorial](https://docs.metakeep.xyz/docs/create-your-first-nft-collection-and-mint-tokens), but you should also be able to follow this by reading the README and exploring its `scripts` directories.

## Quick start

The first thing, you need to do is clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git

cd nfts

npm install
```

### Run createCollectionAndMintToken and lockUnlockToken scripts

Then, on a new terminal, go to the repository's `nfts/backend` folder and run this to
deploy NFT contract and mint token:

```sh
npm run createCollectionAndMintToken
```

After minting a new token, you can `Lock` and `Unlock` token by running the following command:

```sh
npm run lockUnlockToken
```

### Transfer NFT Demo

If you want to check the complete end to end working on Peer to Peer NFT transfer. Follow the following commands.

Open a new terminal and go to the repository's `nfts/backend` folder and run the `npm run mockServer` to start the local server at port number `3001`

Open a second terminal session and go to the repository's `nfts/frontend` folder and run `npm start`.

This will open the frontend application on the default browser of your system. Enter the details like `token Id`, `from email id`, `to email id` for successful nft token transfer.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/nft-101).

For a complete introduction to NFT APIs by MetaKeep, refer to [this guide](https://docs.metakeep.xyz/reference/nft-101).

## Troubleshooting

You can find detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
