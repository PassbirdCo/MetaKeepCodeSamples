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

- `FORBIDDEN` (403) error: API key is not valid


- `INVALID REQUEST` (400) error: Request is not valid e.g if request json has un supported fields.


- `INVALID_NAME` (400) error: Lambda name is either empty or too long. Lambda name currently has a character limit of 20.


- `INVALID_OWNER` (400) error: Lambda owner is not the same as the developer wallet address.

Make sure you are initializing the lambda by passing in your developer account eth address as the lambda owner.


- `IDEMPOTENCY_KEY_MISSING` (400) error: Request without Idempotency key, refer to [this guide](https://docs.metakeep.xyz/reference/idempotency-key)


- `IDEMPOTENCY_PARAMS_MISMATCH` (409) error: Another Request with same Idempotency key, refer to [this guide](https://docs.metakeep.xyz/reference/idempotency-key)


- `SOMETHING_WENT_WRONG` (500) error: Unknown error occurred.
Please get in touch with us if you continue seeing this error.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy _building_!**
