# Account APIs

This repository contains the script

## Files

- `account.js`: Contains the main logic for account management.
- `utils.js`: Contains utility functions used by the account APIs.
- `createApp.js`: Allows you to create a new app for MetaKeep.
- `updateApp.js`: Allows you to update the app by modifying its name, API keys, and user wallet attributes.
- `.env`: Configuration file that needs to be updated with the account key and account secret before running any of the scripts.

## Functions

### `createNewAppUsingAccountKey()`

Creates a new app for MetaKeep with the given name, API key, and user wallet attributes.

- `name` (string): The name of the app.
- `appType` (app type Object): the kind of app that you want to create
Currently we support two types of App Cryptography and Blockchain, for more details checkout here.

### `updateApp(id, data)`

Updates the app with the given ID by modifying its name, API keys, and user wallet attributes.

# How to create Account Key and Account Secret

To create an account key and account secret and login to your developer's account on console.metakeep.xyz, please follow these steps:

Visit the official documentation at https://docs.metakeep.xyz for more details on how to create an account key and account secret.

Once you have obtained the account key and account secret, update the .env file in your project with these credentials. This file is located in the same directory as the account.js, utils.js, createApp.js, and updateApp.js files.

After updating the .env file, you can now run the scripts in your project to create a new app or update an existing app for MetaKeep.

Please note that the .env file should be kept secure and not shared publicly, as it contains sensitive information.

If you have any further questions or need assistance, feel free to ask.
