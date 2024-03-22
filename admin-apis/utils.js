import { generateKeyPairSync, sign, createPrivateKey, getSigningKey, createHash } from "crypto";


export const compressPublicKey = (rawPublicKey) => {
    let ySign = Buffer.alloc(1);
    ySign[0] = 0x2 | (rawPublicKey[63] & 0x01); // encode sign of `y` in first bit
    return Buffer.concat([ySign, rawPublicKey.slice(0, 32)]);
  };

export const generateNewKeyAndSignedMessage = () => {
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
      ])
    );

    const signedMsg = sign("SHA256", Buffer.from("Hello"), {
      key: createPrivateKey({ key: privateKeyJwk, format: "jwk" }),
      dsaEncoding: "ieee-p1363",
    }).toString("base64");

    return {
      key: publicKeyCompressed.toString("base64"),
      signedMsg,
    };
  };


export const generateApiSignature = async (
    httpMethod,
    apiPath,
    idempotencyKey,
    timestampMillis,
    requestDataString,
    key = null,
    secret = null
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
      )
      .toString("base64");
  };