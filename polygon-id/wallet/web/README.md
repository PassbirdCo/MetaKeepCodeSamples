## MetaKeep Polygon ID Demo Wallet Application

This directory contains a sample Polygon ID wallet application with MetaKeep integration.

## Running the Application

Please follow the steps below to run the demo:

### 1. Create MetaKeep Cryptography BabyJubJub App

The first step is to create a `MetaKeep Cryptography BabyJubJub` app on the [MetaKeep console](https://console.metakeep.xyz). Once you have created the app, you will get an `APP_ID`. Save this `APP_ID`.

### 2. Download the project

Afterward, you need to clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

### 3. Update the `.env` file

Navigate to the `polygon-id/wallet/web` directory and update the `APP_ID` in the `.env` file with the `APP_ID` of your MetaKeep Cryptography BabyJubJub app.

### 4. Install dependencies and run the application

```sh
npm install
npm run dev
```

This will open up the wallet application on your system's default browser. You can also open the wallet application by navigating to `http://localhost:3000` in your browser.

You can now use the wallet application to create a new identity, add credentials, and verify them.

## Using the Application

The wallet application allows you to create a new identity, add credentials, and verify them.

### 1. Enter your email

Enter your email address in the input field and click on the `Submit` button. Now you should see multiple buttons on the screen.

### 2. Create a new identity

Click on the `Create Identity` button to create a new identity. Once the identity is created, you will your `DID` on the screen.

### 3. Add KYC age credentials

We will use the [PolygonID sample issuer](https://issuer-ui.polygonid.me/) to issue a `KYCAgeCredential` to your `DID`.

1. Navigate to the [PolygonID sample issuer](https://issuer-ui.polygonid.me/).
2. Import a new `KYCAgeCredential-v4.json` schema from https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v4.json
3. Issue a `SIG` based `KYCAgeCredential` to your `DID` using the schema imported in the previous step and open up the QR code page of the issued credential.
4. Click on the `Add KYC Age Credential` in the wallet application button to add credentials to your identity. It will open up a QR code scanner.
5. Scan the QR code generated in step 4. It might be hard to scan the QR code from the same device, so you can instead take a photo of the QR code from another device and scan it.
6. MetaKeep will ask for your consent to sign a message to create a new credential. Click on the `Allow` button to sign the message and a new credential will be added to your identity.

### 4. View Credentials

Click on the `View Credentials` button to view all the credentials stored in the application.

### 5. Create & Verify Age Proof

We will use the [PolygonID query builder](https://tools.privado.id/query-builder/) tool to generate a `KYCAgeProof` request for your `DID`.

1. Navigate to [PolygonID query builder](https://tools.privado.id/query-builder/).
2. Fill in the required fields:
   1. Enter the URL for json-ld context: https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v4.jsonld
   2. Select `KYCAgeCredential` from the `Schema Type` dropdown.
   3. Select the appropriate `Proof Type` from the dropdown.
   4. Enter the values that you want to verify.
   5. Click on the `Create query` button.
3. Now click on the `Test query` button to generate a QR code.
4. In the app, click on the `Authenticate` button and the `Connect` button in the wallet to create and verify an age proof. It will open up a QR code scanner. Scan the QR code generated in the previous step.
