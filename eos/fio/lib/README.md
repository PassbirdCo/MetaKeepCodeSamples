# FIOWallet Library

The FIOWallet library provides functionalities for interacting with the FIO blockchain, including mapping a public address to a FIO handle.

## Installation

To use the FIOWallet library in your project, install it using `npm`.

First, build the project:

```bash
npm install
npm run build
```

Then, install the package in your project:

```bash
npm install <path_to_lib>
```

Replace `<path_to_lib>` with the path where the library folder exists. We recommend copying the library folder to your project's root directory to avoid any issues.

## Usage

### Creating a `FIOWallet` Instance

First, import the FIOWallet class:

```js
import { FIOWallet } from "fio-wallet";
```

Then, create an instance of FIOWallet by providing the required parameters:

```js
const appId = "fio_app_id_from_metakeep_console";
const user = { email: "your_email@example.com" };

const wallet = new FIOWallet({ appId, user });
```

You can optionally pass the environment param. It defaults to `PRODUCTION`. `PRODUCTION` uses FIO mainnet and `DEVELOPMENT` uses FIO testnet.

```js
import { Environment } from "fio-wallet";

const wallet = new FIOWallet({ appId, user, env: Environment.DEVELOPMENT });
```

### Mapping a Public Address to your FIO Handle

To map a public address to your FIO Handle, call the `mapHandle` method on the FIOWallet instance:

```js
const publicAddress = "your_public_eth_address";

wallet.mapHandle("your_fio_handle@domain", [
  {
    public_address: publicAddress,
    chain_code: "ETH",
    token_code: "ETH",
  },
]);
```

Make sure to replace `your_public_eth_address` with the actual public ETH address you want to map, provide the necessary [chain code and token code](https://github.com/fioprotocol/fips/blob/master/fip-0015.md), and replace `your_fio_handle@handle` with your FIO handle.

You can also provide an optional `reason` string that will be displayed to the user when they sign the transaction:

```js
wallet.mapHandle(
  "your_fio_handle@domain",
  [
    {
      public_address: publicAddress,
      chain_code: "ETH",
      token_code: "ETH",
    },
  ],
  "map your ETH address to your FIO handle"
);
```

### Parameters

- `fioHandle` (string): Your FIO handle.
- `publicAddresses` (array of PublicAddress): An array of PublicAddress to be mapped. Each PublicAddress should have the following properties:
  - `public_address` (string): The public address to be mapped.
  - `chain_code` (string): The chain code.
  - `token_code` (string): The token code.
- `reason` (string, optional): The reason for mapping the public address to the FIO handle. This will be displayed to the user when they sign the transaction.
  If not provided, a default message will be displayed.
