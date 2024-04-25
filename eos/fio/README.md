## FIO - User Transaction Signing Tutorial.

This directory contains a sample project that you can use as a starting point for signing FIO transactions for your end users.

## Directory Structure

The project is organized as follows:

- [frontend](./frontend): Contains the frontend code to register a handler for the FIO public Key and transfer tokens from the end user's wallet to a different wallet.

## Running the Demo

Please follow the steps below to run the demo:

### 1. Create an EOS app

The first step is to create an EOS app on the [MetaKeep console](https://console.metakeep.xyz). Once you have created the app, you will get an `APP ID`. Copy this `APP ID` to the `.env` file in the root directory of the project.

### 2. Download the project

Afterward, you need to clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

### 3. Start the frontend server

Now start the frontend server. Navigate to the `eos/fio/frontend` directory and run the following command:

```sh
npm install
```

To install the FIOWallet library, run 

```sh
npm i <path_to_lib>
```

Replace `<path_to_lib>` with the path where the library exists.



### 3. Start the backend

Now start the backend server. Navigate to the `eos/fio/backend` directory and run the following command:

```sh
npm install
npm run start
```

This will start the backend server on the port 3001.

### 4. Register the user's address on the FIO Testnet Network

We will now register the user's address on the FIO Testnet Network. For the demo, we will try to register the user's email ID(after removing the `@` symbol) as the FIO address.

![Screenshot from 2023-05-24 17-57-26](https://github.com/PassbirdCo/MetaKeepCodeSamples/assets/102578238/cfde4b56-3f0a-41bb-aaee-bf064cd6e591)

Enter your email ID and click on `Register`. You will see your FIO Public Key in the UI and the you will be prompted to sign the transaction.

_Note that FIO public key for the email needs to have tokens to register the address. You can get tokens from the [FIO Faucet](https://monitor.testnet.fioprotocol.io/#faucet)._

After successful registration, you will see the registered FIO address in [FIO Account Info](https://monitor.testnet.fioprotocol.io/#accountInfo).

### 5. Transfer tokens from the user's wallet

We will now transfer tokens from the user's wallet to a different wallet.

![Screenshot from 2023-05-24 17-57-26](https://github.com/PassbirdCo/MetaKeepCodeSamples/assets/102578238/0e85dde4-9af3-46eb-9134-44ff1dd1c046)

To transfer the tokens, enter the receiver's email ID, and the amount to transfer, and click on `Transfer`.

Voila! You have successfully finished the FIO user signing demo 🎉🎉.

## Guide

You can find detailed instructions on using MetaKeep's signing APIs and SDK in the [official documentation](https://docs.metakeep.xyz/).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
