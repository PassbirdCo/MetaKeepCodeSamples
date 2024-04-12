## MetaKeep Polygon ID Demo Wallet Application

This directory contains a sample Polygon ID flutter wallet application with MetaKeep integration.

## Running the Application

Please follow the steps below to run the demo:

### 1. Create MetaKeep Cryptography BabyJubJub App

The first step is to create a `MetaKeep Cryptography BabyJubJub` app on the [MetaKeep console](https://console.metakeep.xyz). Once you have created the app, you will get an `APP_ID`. Save this `APP_ID`.

### 2. Download the project

Afterward, you need to clone this repository and download the dependencies.

```sh
git clone https://github.com/PassbirdCo/MetaKeepCodeSamples.git
```

Then navigate to the `polygon-id/wallet/flutter` directory.

```sh
cd polygon-id/wallet/flutter
```

### 3: Install dependencies

Install the flutter dependencies by running the following command:

```sh
flutter pub get
```

### 4. Update the `.env` file

Update the `METAKEEP_APP_ID` in the `.env` file with the `APP_ID` of your MetaKeep Cryptography BabyJubJub app.

Then, run `build_runner` to generate `.g.dart` files with the environment variables:

```bash
dart run build_runner build --delete-conflicting-outputs
```

### 4. Update android gradle file

Update the `android/app/build.gradle` file to add the `APP_ID` of your MetaKeep Cryptography BabyJubJub app.

```gradle
        //---> Configure MetaKeep Domain and Scheme
        // metakeepDomain: Replace <app_id> with your app's id which you can find in the developer console
        // metakeepScheme: Replace com.domain.app with your app's package name
        manifestPlaceholders += [metakeepDomain: "<app_id>.auth.metakeep.xyz", metakeepScheme: "com.domain.app"]
        //<---
```

### 4. Run the application

Run the following command to start the application:

```sh
flutter run
```

This will start the wallet application on the emulator or connected device. You can now use the wallet application to create a new identity, add credentials, and verify them.

## Using the Application

The wallet application allows you to create a new identity, add credentials, and verify them.

### 1. Create a new identity

Click on the `Create identity` button to create a new identity. You will be asked to enter your email address to create a new identity. Once the identity is created, you will your `DID` on the screen.

### 2. Add KYC age credentials

We will use the [PolygonID sample issuer](https://issuer-ui.polygonid.me/) to issue a `KYCAgeCredential` to your `DID`.

1. Navigate to the [PolygonID sample issuer](https://issuer-ui.polygonid.me/).
2. Import a new `KYCAgeCredential-v4.json` schema from https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v4.json
3. Issue a `SIG` based `KYCAgeCredential` to your `DID` using the schema imported in the previous step and open up the QR code page of the issued credential.
4. Click on the `Authenticate` button, followed by `right arrow` button in the wallet application button to add credentials to your identity. It will open up a QR code scanner.
5. Scan the QR code generated in step 3.
6. MetaKeep will ask for your consent to sign a message to create a new credential. Click on the `Allow` button to sign the message and a new credential will be added to your identity.

### 4. View Credentials

Navigate to the `Authenticate` button, followed by `right arrow` button to view all the credentials stored in the application.

### 5. Create & Verify Age Proof

We will use the [PolygonID sample verifier](https://verifier-demo.polygonid.me/) to generate a `KYCAgeProof` request for your `DID`.

1. Navigate to the [PolygonID sample verifier](https://verifier-demo.polygonid.me/).
2. Choose the `KYCAgeCredential` from the `Credential` dropdown.
3. Make sure that the schema matches the one used to issue the `KYCAgeCredential` in the previous step, else the proof generation will fail.
4. You should see a QR code on the screen.
5. Click on the `Authenticate` button, followed by `Connect` button in the wallet to create and verify an age proof. It will open up a QR code scanner. Scan the QR code generated in step 4.

## Issues

1. iOS simulator does not work since the Polygon ID flutter SDK does not support iOS simulator yet. You can run the application on an Android emulator or a physical Android device.
