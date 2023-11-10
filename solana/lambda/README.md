# MetaKeep Lambda - Invoke Memo Program in Solana

This repository contains a simple application to invoke method in Solana Blockchain that you can use as the starting point
for using MetaKeep's Lambda Infrastructure.

This project is intended to be used with the
[MetaKeep Lambda Creation and Invocation Tutorial Series](https://docs.metakeep.xyz/docs/create-your-first-lambda), but you should be
able to follow it by yourself by reading the README and exploring its, `backend`, `scripts` and `frontend` directories.

## Directory Structure

The project is organized as follows:

- [scripts](./scripts): Contains the scripts to invoke Memo Contract in Solana Blockchain.
- [backend](./backend): Contains the backend code for the server to generate a consent token to invoke a memo Program
- [frontend](./frontend): Contains the frontend code and server for invoking the memo Program

## Quick start

The first thing you need to do is clone this repository:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

go to the repository's `solana/lambda/scripts` folder and run the following commands to invoke the memo program as the developer.

```sh
npm install
npm run create
```

After you have created the Lambda, you can invoke a method by running the following command.

```sh
npm run invoke
```

This will invoke a lambda method as developer(you).

# How to invoke a Lambda method on behalf of users by getting their consent.

If you want to invoke the Lambda function using end-user's wallet, you need their consent. To get consent you need to use the MetaKeep SDK. Run the following commands for an end-to-end demo for Lambda Invocation for the end-user.

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

The demo application allows you to invoke method in lambda

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
