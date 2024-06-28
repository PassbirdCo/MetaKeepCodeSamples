# MetaKeep Lambda - Solana

This repository contains a simple application to demonstrate MetaKeep's Lambda Infrastructure on the Solana Blockchain. MetaKeep Lambda provides the best developer and user experience for building applications on the Solana Blockchain. You don't need to worry about the infrastructure, gas fees, retries, and other complexities of the blockchain. You can focus on building your application and leave the rest to us.

This project is intended to be used with the
[MetaKeep Solana Lambda Tutorial Series](https://docs.metakeep.xyz/docs/invoke-solana-lambda), but you should be
able to follow it by yourself by reading the README and exploring its, `backend`, `scripts`, and `frontend` directories.

## Directory Structure

The project is organized as follows:

- [scripts](./scripts): Contains the scripts to invoke the [memo program](https://spl.solana.com/memo) with and without external signers.
- [backend](./backend): Contains the backend code for the server to generate a consent token to invoke the memo Program with or without external_signers as an end-user.
- [frontend](./frontend): Contains the frontend code and server for getting use user consent and invoking the memo Program with or without external signer as an end-user.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Navigate to repository's `solana/lambda/scripts` folder and run the following commands to invoke the memo program as you(the developer).

```sh
npm install
npm run invoke
```

Then, run the following command to invoke the memo program as you(the developer) and an external signer. The script will create a partially signed transaction and invoke the MetaKeep Lambda to sign and broadcast the transaction as you(the developer).

```sh
npm run invokeWithExternalSigners
```

You can also run a batch of transactions in the batch mode by running the following command. This will invoke multiple memo programs in a batch parallelly.

```sh
npm run invokeBatch
```

# Invoke Solana lambda method on behalf of end-users by getting their consent.

If you want to invoke the Lambda using the end user's wallet, you need their consent. To get the consent you need to use the MetaKeep SDK. Run the following commands for an end-to-end Lambda invocation demo on behalf of the end-user.

Start the backend server by running the following command in the `solana/lambda/backend` directory.

```sh
npm install
npm run start
```

This will start a server at port number `3001`.

Start the frontend server by running the following command in the `solana/lambda/frontend` directory.

```sh
npm install
npm run start
```

The demo application allows you to invoke Solana lambda on behalf of end-users.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/solana-lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/solana-lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdainvoke) that would help you troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
