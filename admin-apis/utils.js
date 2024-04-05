import { sign, createPrivateKey, createHash } from "crypto";
import axios from "axios";
import ec_pkg from "elliptic";
const { ec } = ec_pkg;

export const checkEnvVariables = (otherRequiredEnvVariables = []) => {
  const requiredEnvVariables = [
    "ACCOUNT_KEY",
    "ACCOUNT_SECRET",
    "API_ENDPOINT",
  ];

  requiredEnvVariables.push(...otherRequiredEnvVariables);

  const missingEnvVariables = requiredEnvVariables.filter(
    (envVariable) => !process.env[envVariable]
  );

  if (missingEnvVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingEnvVariables.join(", ")}`
    );
  }
};

const getSigningKey = async (key, secret) => {
  const pubKey = new ec("p256").keyFromPublic(Buffer.from(key, "base64"));

  // Remove padding from x and y
  const x = Buffer.from(pubKey.getPublic().getX().toBuffer()).toString(
    "base64"
  );
  const y = Buffer.from(pubKey.getPublic().getY().toBuffer()).toString(
    "base64"
  );

  const signingKey = {
    key: createPrivateKey({
      key: {
        kty: "EC",
        // P-256 curve
        crv: "P-256",
        x: x,
        y: y,
        d: secret,
      },
      format: "jwk",
    }),
    dsaEncoding: "ieee-p1363",
  };
  return signingKey;
};

export const compressPublicKey = (rawPublicKey) => {
  const u8full = new Uint8Array(rawPublicKey);
  const len = u8full.byteLength;
  const u8 = u8full.slice(0, (1 + len) >>> 1); // drop `y`
  u8[0] = 0x2 | (u8full[len - 1] & 0x01); // encode sign of `y` in first bit
  return u8.buffer;
};

export const generateApiSignature = async (
  httpMethod,
  apiPath,
  idempotencyKey,
  timestampMillis,
  requestDataString,
  accountKey,
  accountSecret
) => {
  const hostElement = `${process.env.API_ENDPOINT}\n`;
  const methodElement = `${httpMethod}\n`;
  const pathElement = `${apiPath}\n`;

  // Idempotency key is optional
  const idempotencyElement = idempotencyKey
    ? `Idempotency-Key:${idempotencyKey}\n`
    : "";

  const timestampElement = `X-Timestamp:${timestampMillis}\n`;

  // If there is no request data, use an empty string
  const dataElement = requestDataString || "";
  const key = accountKey.replace("account_key_", "");
  const secret = accountSecret.replace("account_secret_", "");

  const signingKey = await getSigningKey(key, secret);

  return sign(
    "SHA256",
    createHash("SHA256")
      .update(
        hostElement +
          methodElement +
          pathElement +
          idempotencyElement +
          timestampElement +
          dataElement,
        "utf8"
      )
      .digest(),
    signingKey
  ).toString("base64");
};

export const callAdminAPI = async (path, requestBody) => {
  const timestamp = Date.now().toString();
  const apiSignature = await generateApiSignature(
    "POST",
    path,
    null,
    timestamp,
    JSON.stringify(requestBody),
    process.env.ACCOUNT_KEY,
    process.env.ACCOUNT_SECRET
  );

  const response = await axios.post(
    `https://${process.env.API_ENDPOINT}/${path}`,
    requestBody,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Timestamp": timestamp,
        "X-Api-Signature": apiSignature,
        "X-Account-Key": process.env.ACCOUNT_KEY,
      },
    }
  );

  return response.data;
};

export const fetchAppsByAccountKey = async (appId = null) => {
  const responseData = await callAdminAPI("/v2/app/list", {
    appIds: appId ? [appId] : [],
  });
  return responseData.apps || [];
};
