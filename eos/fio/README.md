## FIO - User Transaction Signing Tutorial.

This directory contains a sample project that you can use as a starting point for signing FIO transactions for your end users.

## Directory Structure

The project is organized as follows:

- [frontend](./frontend): Contains the frontend code to register a FIO handle for the user, transfer tokens from the end user's wallet to a different wallet, and map the public address to the FIO handle.
- [backend](./backend): Contains the backend code to buy/register FIO handles for the user.
- [lib](./lib): Contains the FIOWallet library that provides functionalities for interacting with the FIO blockchain, including mapping a public address to a FIO handle.

## Running the Demo

Please follow the steps below to run the demo:

### 1. Create an EOS/FIO app

The first step is to create an EOS app on the [MetaKeep console](https://console.metakeep.xyz). Once you have created the app, you will get an `APP ID`. Save this `APP ID` as you will need it later.

### 2. Download the project

Afterward, you need to clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

### 3. Start the frontend server

Now start the frontend server. Navigate to the `eos/fio/frontend` directory and update the `APP_ID` in the `.env` file with the `APP ID` you got from the MetaKeep console. Then run the following command:

```sh
npm install
npm run start
```

### 4. Start the backend

Now start the backend server. Navigate to the `eos/fio/backend` directory and update the `.env` file with the `FIO_REFERRAL_CODE` and `FIO_API_TOKEN` you got from the FIO team. Then run the following command:

```sh
npm install
npm run start
```

This will start the backend server on the port 3001.

### 5. Register a handle for the user

We will now register a FIO handle for the user. Open the frontend server in your browser.

Enter your email and the handle you want to register, and click on `Register`. After successful registration, you should be able to see the handle on the [FIO explorer](https://fio.bloks.io/).

### 6. Transfer tokens from the user's wallet

We will now transfer tokens from the user's wallet to a different wallet.

To transfer the tokens, enter the receiver's email, and the amount to transfer, and click on `Transfer`.

You will see a success message if the transfer is successful. You can verify the transfer on the [FIO explorer](https://fio.bloks.io/).

## 7. Mapping a public address to the FIO handle

We will now map a public address to the FIO handle.

Navigate to the `Map Handle` tab, enter your email, FIO handle, and public ETH address, and then click on `Map Handle`.

You will see a success message if the mapping is successful. You can verify the mapping on the [FIO explorer](https://fio.bloks.io/).

Voila! You have successfully finished the FIO tutorial 🎉🎉.

## Guide

You can find detailed instructions on using MetaKeep's signing APIs and SDK in the [official documentation](https://docs.metakeep.xyz/).

## Troubleshooting

You can find a detailed list of the errors [here](https://docs.metakeep.xyz/reference/api-error-status) that would help you to troubleshoot.

## Getting help and updates

If you need help with this project, or with MetaKeep APIs in general, please read [this guide](https://docs.metakeep.xyz/) to learn where and how to get it.

For the latest news about MetaKeep, [follow us on Twitter](https://twitter.com/metakeep), and don't forget to star [our GitHub repository](https://github.com/PassbirdCo/MetaKeepCodeSamples.git)!

**Happy*building*!**
