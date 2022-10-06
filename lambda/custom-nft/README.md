# MetaKeep Lambda - Simple Voting Application

This repository contains a simple Voting Application that you can use as the starting point
for using MetaKeep's Lambda Infrastructure.

This project is intended to be used with the
[MetaKeep Lambda Creation and Invocation Tutorial Series](https://docs.metakeep.xyz/docs/create-your-first-lambda), but you should be
able to follow it by yourself by reading the README and exploring its
`contracts` directories.

## Directory Structure

The project is organized as follows:

- [contracts](./contracts): Contains the Smart Contract for Custom ERC721 Tokens.

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Then, on a new terminal, go to the repository's `lambda/custom-nft/contracts` folder and run this to
compile your smart contract:

```sh
npm install
npx hardhat compile
```

Once the contract has been compiled, go to the repository's `lambda/voting/scripts` folder and run the following commands to create a new Lambda and call the voting method directly as a developer.

```sh
npm install
npm run create
```

After you have created the Lambda, you can invoke a method by running the following command.

```sh
npm run invoke
```

This will register a new candidate and vote for the candidate as developer(you).

# How to invoke a Lambda method on behalf of users by getting their consent.

If you want to invoke the Lambda function using end-user's wallet, you need their consent. To get consent you need to use the MetaKeep SDK. Run the following commands for an end-to-end demo for Lambda Invocation for the end-user.

Start the backend server by running the following command in the `lambda/voting/backend` directory.

```sh
npm install
npm run start
```

This will start a server at port number `3001`.

Start the frontend server by running the following command in the `lambda/voting/frontend` directory.

```sh
npm install
npm run start
```

The demo application allows you to register and vote for the candidate.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
