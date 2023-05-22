## FIO - End User transaction signing tutorial.

This directory contains a sample project that you can use as a starting point to sign FIO transactions for your developer wallet and ask end users to sign the transaction from their wallet.

This Project is intended to be used with the [Fio Transaction Signing Tutorial](https://docs.metakeep.xyz/docs/solana-developer-transaction-signing), but you should also be able to follow by reading this README.

## Directory Structure

The project is organized as follows:

- [frontend](./frontend): Contains the frontend code to register a handler for FIO public Key and transfer tokens from the end user wallet to any other wallet.

## Quick start

The first thing, you need to do is clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

### Transfer tokens from an end-user wallet

Now we will start the frontend server to sign a transaction from an end-user wallet and send it to the chain.

Open a second terminal session and navigate to the repository's `eos/fio/frontend` folder and run

```sh
npm install
npm run start
```

This will open up the frontend application on the default browser of your system.

## User Guide

You can find detailed instructions on using MetaKeep's signing APIs and SDK in the [official documentation](https://docs.metakeep.xyz/).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
