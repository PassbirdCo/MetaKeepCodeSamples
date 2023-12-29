## MetaKeep Polygon ID Integration Demo

This directory contains a sample project that you can use as a starting point for integrating MetaKeep with Polygon ID infrastructure.
The integration requires minimal amount of code using the [MetaKeep JavaScript SDK](https://docs.metakeep.xyz/reference/sdk-101).

## Directory Structure

The project is organized as follows:

- [wallet](./wallet): Contains the frontend polygon ID wallet application with MetaKeep integration. Please refer to the [README](./wallet/README.md) for more details on how to run the wallet application.

## Running the Demo

Please follow the steps below to run the demo:

### 1. Create MetaKeep Cryptography BabyJubJub App

The first step is to create a `MetaKeep Cryptography BabyJubJub` app on the [MetaKeep console](https://console.metakeep.xyz). Once you have created the app, you will get an `APP ID`. Copy this `APP ID` to the `.env` file in the `wallet` directory.

### 2. Download the project

Afterward, you need to clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

### 3. Start the wallet application

Now start the wallet application. Navigate to the `polygon-id/wallet` directory and run the following command:

```sh
npm install
npm run dev
```

This will open up the wallet application on your system's default browser. You can also open the wallet application by navigating to `http://localhost:3000` in your browser.

You can now use the wallet application to create a new identity, add credentials, and verify them.

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
