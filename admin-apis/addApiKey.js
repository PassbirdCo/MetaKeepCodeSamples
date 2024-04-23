import {
  callAdminAPI,
  checkEnvVariables,
  fetchAppsByAccountKey,
} from "./utils.js";
import { compressPublicKey } from "./utils.js";
import * as dotenv from "dotenv";
import { subtle } from "crypto";

dotenv.config();

checkEnvVariables(["APP_ID"]);

function bytesArrayToBase64(bytes) {
  // Convert the byte array to a Buffer
  const buffer = Buffer.from(bytes);
  // Encode the Buffer to Base64
  const base64String = buffer.toString("base64");
  return base64String;
}

const addApiKey = async () => {
  // Find the app by ID
  const app = (await fetchAppsByAccountKey(process.env.APP_ID))[0];
  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }

  // Generate a new key pair
  // API key is the public key and API secret is the private key
  //
  // This API can be used to generate API key/secret pairs for your app
  // in the browser using the Web Crypto API.
  const keyPair = await subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  );

  const key = await subtle.exportKey("raw", keyPair.publicKey);

  // These are the API key and API secret that you can use to authenticate
  // with the API.
  const API_KEY = bytesArrayToBase64(compressPublicKey(key));
  const API_SECRET = (await subtle.exportKey("jwk", keyPair.privateKey)).d;

  // Create a signed message to prove ownership of the secret key
  const signedMessageB64 = bytesArrayToBase64(
    await subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      keyPair.privateKey,
      new TextEncoder().encode("Hello")
    )
  );

  const newKey = {
    name: `API-Key-${Date.now()}`,
    apiKey: API_KEY,
    // Sign the message "Hello" with the private key to prove ownership
    // of the secret key.
    signedHelloMessage: signedMessageB64,
  };

  const updateAppData = {
    appId: process.env.APP_ID,
    apiKeys: {
      addApiKeys: [newKey],
    },
  };

  return await callAdminAPI("/v2/app/update", updateAppData); // Return response data
};

addApiKey().then((response) => {
  console.log(response);
});
