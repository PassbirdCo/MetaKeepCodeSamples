# FIOWallet Class

The FIOWallet class provides functionalities for interacting with the FIO blockchain, including mapping a public address to a FIO address.

## Installation

To use the FIOWallet class in your project, you can install it via npm:

```bash
npm install fio-wallet

yarn add fio-wallet
```

## Usage

### Creating a FIOWallet Instance

- First, import the FIOWallet class:

```js
import { FIOWallet } from "fiowallet";
```

- Then, create an instance of FIOWallet by providing the required parameters:

```js
const appId = "your_app_id";
const email = "your_email@example.com";
const wallet = new FIOWallet(appId, email);
```

## Mapping a Public Address to a FIO Address

### To map a public address to a FIO address, call the mapHandle method on the FIOWallet instance:

```js
const publicAddress = "your_public_address";
wallet.mapHandle({
  appId: process.env.REACT_APP_APP_ID,
  publicAddress: publicAddress,
  email: email,
  chainCode: "ETH",
  tokenCode: "ETH",
});
```
Make sure to replace 'your_public_address' with the actual public address you want to map, and provide the necessary chain code and token code.

## mapHandle method


### Parameters

- `appId`: The application ID.
- `publicAddress`: The public address to be mapped.
- `email`: The user's email address.
- `chainCode`: The chain code associated with the public address.
- `tokenCode`: The token code associated with the public address.