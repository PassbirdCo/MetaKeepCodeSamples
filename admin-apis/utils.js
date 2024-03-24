import { sign, createPrivateKey, createHash } from "crypto";
import pkg from "elliptic";
const { ec } = pkg;

export const checkEnvVariables = (checkAppId = true) => {
  const requiredEnvVariables = [
    "ACCOUNT_KEY",
    "ACCOUNT_SECRET",
    "API_ENDPOINT",
  ];
  if (checkAppId) {
    requiredEnvVariables.push("APP_ID");
  }
  const missingEnvVariables = requiredEnvVariables.filter(
    (envVariable) => !process.env[envVariable],
  );

  if (missingEnvVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingEnvVariables.join(", ")}`,
    );
  }
};

const getSigningKey = async (key, secret) => {
  const pubKey = new ec("p256").keyFromPublic(Buffer.from(key, "base64"));

  // Remove padding from x and y
  const x = Buffer.from(pubKey.getPublic().getX().toBuffer()).toString(
    "base64",
  );
  const y = Buffer.from(pubKey.getPublic().getY().toBuffer()).toString(
    "base64",
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
  let ySign = Buffer.alloc(1);
  ySign[0] = 0x2 | (rawPublicKey[63] & 0x01); // encode sign of `y` in first bit
  return Buffer.concat([ySign, rawPublicKey.slice(0, 32)]);
};

export const generateApiSignature = async (
  httpMethod,
  apiPath,
  idempotencyKey,
  timestampMillis,
  requestDataString,
  accountKey,
  accountSecret,
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
  const key = accountKey ? accountKey.replace("account_key_", "") : null;
  const secret = accountSecret
    ? accountSecret.replace("account_secret_", "")
    : null;
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
        "utf8",
      )
      .digest(),
    signingKey,
  ).toString("base64");
};
