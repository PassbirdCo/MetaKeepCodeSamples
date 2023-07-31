# MetaKeep Lambda - Batch Transactions

This repository contains a simple voting Application that you can use as the starting point for using batch transactions on MetaKeep's Lambda Infrastructure.

This project is intended to be used with the
[MetaKeep Lambda Business Wallet Batch Transactions](https://docs.metakeep.xyz/docs/lambda-business-wallet-batch-transactions), but you should be
able to follow it by yourself by reading the README and exploring its
`smart-contracts`, `backend`, `scripts`, and `frontend` directories.

## Directory Structure

The project is organized as follows:

- [smart-contracts](./smart-contracts): Contains the smart contract for voting.
- [scripts](./scripts): Contains the scripts to deploy a new Lambda smart contract and invoke Lambda functions.
- [backend](./backend): Contains the backend code for the server to generate a consent token to vote for a proposal and create a new proposal.
- [frontend](./frontend): Contains the frontend code and server for proposal registration and voting.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

_Once you have cloned the repository, you must fund your MetaKeep Business Wallet with MATIC tokens that you can get from faucet or buy from any popular exchange for Polygon Mainnet._

Then, on a new terminal, go to the repository's `lambda/business-wallet/batch-transactions/smart-contracts` folder and run this to
compile your smart contract:

```sh
npm install
npx hardhat compile
```

Once the contract has been compiled, go to the repository's `lambda/business-wallet/batch-transactions/scripts` folder and update the `.env` file with the API key.

Then, run the following commands to create a new Lambda.

```sh
npm install
npm run create
```

You will get the crated Lambda address in the console. Copy the address and update the `.env` file with the Lambda address.

After you have created the Lambda, run the following command to register a new proposal and vote for the proposal as the developer(you).

```sh
npm run registerAndVote
```

## Register and vote as end-users.

To register and vote an end-users, you need their consent. To get consent you need to use the MetaKeep SDK.

_Note that you must fund user's MetaKeep Business Wallet with MATIC tokens that you can get from faucet or buy from any popular exchange for Polygon Mainnet._

Start the backend server by navigating to `lambda/business-wallet/batch-transactions/backend` directory. Then the update the `.env` file with the Lambda address and run the following commands.

```sh
npm install
npm run start
```

This will start a server at port number `3001`.

Start the frontend server by running the following command in the `lambda/business-wallet/batch-transactions/frontend` directory.

```sh
npm install
npm run start
```

This will open up the demo application on your browser at port number `3000`.
The demo application allows you to register and vote for the proposal.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
