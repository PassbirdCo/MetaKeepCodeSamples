# Lambda Example

This repository contains a sample project that you can use as the starting point
for using MetaKeep's Lambda Infrastructure.

This project is intended to be used with the
[MetaKeep Lambda Creation and Invocation Tutorial Series](https://docs.metakeep.xyz/reference/lambda-101), but you should be
able to follow it by yourself by reading the README and exploring its
`smart-contracts`, `backend`, and `scripts` directories.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
cd lambda/voting
npm install
```

Then, on a new terminal, go to the repository's `lambda/voting/smart-contracts` folder and run this to
compile your smart contract:

```sh
npm install

npx hardhat compile
```

Once the contract has been deployed, go to the repository's `lambda/voting/scripts` folder and run the following commands
to create Lambda and call the voting method directly as developer.

```sh
npm install

npm run create
```

After you have created the lambda, you can invoke a method by running the following command.

```sh

npm run invoke

```

# How to invoke a Lambda Method on behalf of users by getting their consent.

If you want to invoke a lambda method on behalf of user, you need their consent. To get a consent you need to use METAKEEP SDK. Run the following commands for end to end tutorial for Lambda Invocation through user.

Start a Mock Server by running the following command in the `lambda/voting/backend` directory.

```sh

npm install

npm run mockServer
```

This will start a server at port number `3001`.

Open the frontend application by running the following command in the `lambda/voting/frontend` directory

```sh

npm install

npm start
```

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

You can find detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status#v2applambdacreate) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
