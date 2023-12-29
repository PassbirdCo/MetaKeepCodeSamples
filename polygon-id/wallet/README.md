## MetaKeep Polygon ID Demo Wallet Application

This directory contains a sample Polygon ID wallet application with MetaKeep integration.

## Running the Application

Please follow the steps below to run the demo:

### 1. Update the `.env` file

Update the `APP_ID` in the `.env` file with the `APP ID` of your MetaKeep Cryptography BabyJubJub app.

### 2. Install dependencies and run the application

```sh
npm install
npm run dev
```

## Using the Application

The wallet application allows you to create a new identity, add credentials, and verify them.

### 1. Enter your email

Enter your email address in the input field and click on the `Submit` button. Now you should see multiple buttons on the screen.

### 2. Create a new identity

Click on the `Create Identity` button to create a new identity. Once the identity is created, you will your `DID` on the screen.

### 3. Add credentials

We will use the [PolygonID sample issuer](https://issuer-ui.polygonid.me/) to issue a `KYCAgeCredential` to your `DID`.

1. Navigate to the [PolygonID sample issuer](https://issuer-ui.polygonid.me/).
2. Import a new `KYCAgeCredential-v4.json` schema from https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v4.json
3. Issue a `SIG` based `KYCAgeCredential` to your `DID` using the schema imported in the previous step.
4. Go the details page of the issued credential and copy the URL(E.g. https://issuer-ui.polygonid.me/credentials/issued/65f79d53-a5db-11ee-93b5-0242ac120009).
5. Click on the `Add KYC Age Credential` button to add credentials to your identity. Enter the credential URL in the dialog box and click on the `Add` button.
6. MetaKeep will ask for your consent to sign a message to create a new credential. Click on the `Allow` button to sign the message and a new credential will be added to your identity.

### 4. View credentials

Click on the `View Credentials` button to view all the credentials stored in the application.

### 5. Create & Verify Age Proof

We will use the [PolygonID sample verifier](https://verifier-demo.polygonid.me/) to generate a `KYCAgeProof` request for your `DID`.

1. Navigate to the [PolygonID sample verifier](https://verifier-demo.polygonid.me/).
2. Chose the `KYCAgeCredential` from the `Credential` dropdown.
3. You should see a QR code on the screen. Scan the QR code using the MetaKeep mobile app to generate a `KYCAgeProof` request.
4. Make sure that the schema matches the one used to issue the `KYCAgeCredential` in the previous step, else the proof generation will fail.

Now click on the `Create & Verify Age Proof` button to create and verify an age proof locally. Note that for demo purpose this is a only a local verification and doesn't involve any remote verifier. In a real world scenario, the verifier would be involved in the verification process.
