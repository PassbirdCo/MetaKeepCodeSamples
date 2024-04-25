# FIOWallet Library

The FIOWallet library provides functionalities for interacting with the FIO blockchain, including mapping a public address to a FIO address.

## Installation

To use the FIOWallet library in your project, you can install it using `npm` to test it:

- First, build the project:

```bash
npm run build
```

- Install the published package in your project:

```bash
npm install <path_to_lib>
```

Replace `<path_to_lib>` with the path where the library folder exists.

## Usage

### Creating a FIOWallet Instance

- First, import the FIOWallet class:

```js
import { FIOWallet } from "fio-wallet";
```

- Then, create an instance of FIOWallet by providing the required parameters:

```js
const appId = "your_app_id";
const user = { email: "your_email@example.com" };
const wallet = new FIOWallet({ appId, user });
```

You can optionally pass the environment param. It defaults to `PRODUCTION`.

```js
const wallet = new FIOWallet({ appId, user, env: "DEVELOPMENT" });
```

## Mapping a Public Address to a FIO Address

### To map a public address to a FIO address, call the mapHandle method on the FIOWallet instance:

```js
const publicAddress = "your_public_eth_address";
wallet.mapHandle("your_fio_handle", [
  {
    public_address: publicAddress,
    chain_code: "ETH",
    token_code: "ETH",
  },
]);
```

Make sure to replace `your_public_eth_address` with the actual public address you want to map, and provide the necessary [chain code and token code](https://github.com/fioprotocol/fips/blob/master/fip-0015.md) and `your_fio_handle` with the FIO handle.

### Parameters

- `fioHandle` (string): Your FIO handle.
- `publicAddresses` (array of objects): An array of objects representing public addresses to be mapped. Each object should have the following properties:
  - `public_address` (string): The public address to be mapped.
  - `chain_code` (string): The chain code.
  - `token_code` (string): The token code.
