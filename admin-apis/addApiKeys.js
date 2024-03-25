import { callAdminAPI, checkEnvVariables } from "./utils.js";
import { compressPublicKey } from "./utils.js";
import * as dotenv from "dotenv";
import fetchAppListByAccountKey from "./fetchAllApps.js";
import { subtle } from "crypto";

dotenv.config();

checkEnvVariables();

function bytesArrayToBase64(bytes) {
  // Convert the byte array to a Buffer
  const buffer = Buffer.from(bytes);
  // Encode the Buffer to Base64
  const base64String = buffer.toString("base64");
  return base64String;
}

const findAppById = async (appId) => {
  const apps = await fetchAppListByAccountKey();
  const foundApp = apps.find((app) => app.appId === appId);

  return foundApp;
};

const updateApp = async () => {
  const timestamp = Date.now().toString();

  // Find the app by ID
  const app = await findAppById(process.env.APP_ID);
  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }

  // generate a new key pair
  const keyPair = await subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"],
  );

  const key = await subtle.exportKey("raw", keyPair.publicKey);
  const compressedB64PublicKey = bytesArrayToBase64(compressPublicKey(key));
  const signedMessageB64 = bytesArrayToBase64(
    await subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      keyPair.privateKey,
      new TextEncoder().encode("Hello"),
    ),
  );
  const newKey = {
    name: `Key-${Date.now()}`,
    api_key: compressedB64PublicKey,
    signed_hello_message: signedMessageB64,
  };

  const updateAppData = {
    appId: process.env.APP_ID,
    apiKeys: {
      addApiKeys: [newKey],
    },
  };

  return await callAdminAPI("/v2/app/update", updateAppData); // Return response data
};

updateApp().then((response) => {
  console.log(response);
});
