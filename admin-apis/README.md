# Account APIs

This repository contains the script

## Files

- `account.js`: Contains the main logic for account management.
- `utils.js`: Contains utility functions used by the account APIs.
- `createApp.js`: Allows you to create a new app for MetaKeep.
- `updateApp.js`: Allows you to update the app by modifying its name, API keys, and user wallet attributes.
- `addApiKeys.js`: Allows you to add new api keys to your app.
- `deleteApiKeys.js`: allows you to delete api Keys of your app.
- `.env`: Configuration file that needs to be updated with the account key and account secret before running any of the scripts.

# How to create Account Key and Account Secret

To create an account key and account secret and login to your developer's account on console.metakeep.xyz, please follow these steps:

Visit the official documentation at https://docs.metakeep.xyz for more details on how to create an account key and account secret.

Once you have obtained the account key and account secret, update the .env file in your project with these credentials. This file is located in the same directory as the utils.js, createApp.js, and updateApp.js files.

After updating the .env file, you can now run the scripts in your project to create a new app or update an existing app for MetaKeep.

Please note that the .env file should be kept secure and not shared publicly, as it contains sensitive information.

If you have any further questions or need assistance, feel free to ask.

# Commands

To run each script, use the following commands:

- `npm run createAppUsingAccountKey`: Runs the `createApp.js` script to create new App in MetaKeep.
- `npm run addApiKeysUsingAccountKey`: Runs the `addApiKeys.js` script to add new API keys to your app.
- `npm run deleteApiKeysUsingAccountKey`: Runs the `deleteApiKeys.js` script to delete API keys of your app.
- `npm run updateAppUsingAccountKey`: Runs the `updateApp.js` script to update the app by modifying its name, API keys, and user wallet attributes.
