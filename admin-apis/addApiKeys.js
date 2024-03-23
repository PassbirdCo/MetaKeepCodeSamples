import { generateKeyPairSync, sign } from "crypto";
import { generateApiSignature } from "./utils.js";
import { compressPublicKey } from "./utils.js";
import { createPrivateKey } from "crypto";
import axios from "axios";
import * as dotenv from "dotenv";
import fetchAppListByAccountKey from "./fetchAllApps.js";

dotenv.config();

const findAppById = async (appId) => {
  const apps = await fetchAppListByAccountKey();
  const foundApp = apps.find((app) => app.appId === appId);

  return foundApp;
};

const updateAppUsingAccountKey = async () => {
  const timestamp = Date.now().toString();
  const updatedAppName = "MyApp-Updated";

  // Find the app by ID
  const app = await findAppById(process.env.APP_ID);
  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }
  console.log(app);

  // generate a new key pair
  const keyPair = generateKeyPairSync("ec", {
    namedCurve: "P-256", // Options
    publicKeyEncoding: {
      type: "spki",
      format: "jwk",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "jwk",
    },
  });

  const publicKeyJwk = keyPair.publicKey;
  const privateKeyJwk = keyPair.privateKey;

  const publicKeyCompressed = compressPublicKey(
    Buffer.concat([
      Buffer.from(publicKeyJwk.x, "base64"),
      Buffer.from(publicKeyJwk.y, "base64"),
    ]),
  );

  const publicKey = publicKeyCompressed.toString("base64");

  const newKey = {
    name: `Key-${Date.now()}`,
    api_key: publicKey,
    signed_hello_message: sign("SHA256", Buffer.from("Hello"), {
      key: createPrivateKey({ key: privateKeyJwk, format: "jwk" }),
      dsaEncoding: "ieee-p1363",
    }).toString("base64"),
  };

  const updateAppData = {
    name: updatedAppName,
    appId: process.env.APP_ID,
    apiKeys: {
      add_api_keys: [newKey],
    },
  };

  const apiSignature = await generateApiSignature(
    "POST",
    "/v2/app/update",
    null,
    timestamp,
    JSON.stringify(updateAppData),
    process.env.ACCOUNT_KEY,
    process.env.ACCOUNT_SECRET,
  );

  const response = await axios.post(
    `https://${process.env.API_ENDPOINT}/v2/app/update`,
    updateAppData,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Timestamp": timestamp,
        "X-Api-Signature": apiSignature,
        "X-Account-Key": "account_key_" + process.env.ACCOUNT_KEY,
      },
    },
  );

  return response.data; // Return response data
};

updateAppUsingAccountKey().then((response) => {
  console.log(response);
});
