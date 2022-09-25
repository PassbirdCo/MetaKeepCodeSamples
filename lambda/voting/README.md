# Lambda Example

This repository contains a sample project that you can use as the starting point
for using MetaKeep's Lambda Infrastructure.

This project is intended to be used with the
[MetaKeep Lambda Creation and Invocation Tutorial](https://docs.metakeep.xyz/reference/lambda-101), but you should be
able to follow it by yourself by reading the README and exploring its
`contracts`, `tests`, and `scripts` directories.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
cd lambda/voting
npm install
```

Then, on a new terminal, go to the repository's lambda/voting folder and run this to
deploy your contract:

```sh
npm run deploy
```

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://docs.metakeep.xyz/reference/lambda-101).

For a complete introduction to MetaKeep Lambda, refer to [this guide](https://docs.metakeep.xyz/reference/lambda-101).

## Troubleshooting

- `Idempotency Key Mismatched` errors: if you are seeing this error while calling the API, ensure that you generate a new random Idempotency key. For more information on Idempotency Key, refer to [this guide](https://docs.metakeep.xyz/reference/idempotency-key)

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/PassbirdCo), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy _building_!**