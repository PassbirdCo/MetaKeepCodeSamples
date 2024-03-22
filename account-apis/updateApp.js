import { generateKeyPairSync, sign } from "crypto";
import { generateApiSignature } from "./utils";

const updateAppUsingAccountKey = async () => {

    const timestamp = Date.now().toString();
    const updatedAppName = "MyApp-Updated";
    

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
        ])
    );

    const publicKey = publicKeyCompressed.toString("base64");

    const newKey = {
        name: `Key-${Date.now()}`,
        api_key: publicKey,
        signed_hello_message: sign("SHA256", Buffer.from("Hello"), {
            key: createPrivateKey({ key: privateKeyJwk, format: "jwk" }),
            dsaEncoding: "ieee-p1363",
        }).toString("base64"),
    }
    
    const updateAppData = {
        name: updatedAppName,
        appId: process.env.APP_ID,
        api_keys_info: {
            add_api_keys: [newKey],
        }
    }

    const apiSignature = await generateApiSignature(
        "POST",
        "/v2/app/update",
        null,
        timestamp,
        JSON.stringify(updateAppData),
        process.env.ACCOUNT_KEY,
        process.env.ACCOUNT_SECRET
    )

    const response = await fetch(`${process.env.API_ENDPOINT}/v2/app/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Timestamp": timestamp,
            "Authorization": `Bearer ${process.env.ACCOUNT_KEY}`,
            "X-Api-Signature": apiSignature,
            "X-Account-Key": "account_key_" + process.env.ACCOUNT_KEY,
        },
        body: JSON.stringify(updateAppData),
    });


    return response.json();
}

updateAppUsingAccountKey().then((response) => {
    console.log(response);
});