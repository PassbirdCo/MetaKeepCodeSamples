import { generateApiSignature } from "./utils";

const createNewAppUsingAccountKey = async () => {
    const timestamp = Date.now().toString();
    const appName = "MyApp";
    const createAppData = {
        blockchain: {
            chainId: "CHAIN_ID_POLYGON_MAINNET",
        },
        name: appName,
    }

    const apiSignature = await generateApiSignature(
        "POST",
        "/v2/app/create",
        null,
        timestamp,
        JSON.stringify(createAppData),
        process.env.ACCOUNT_KEY,
        process.env.ACCOUNT_SECRET
    )

    const response = await fetch(`${process.env.API_ENDPOINT}/v2/app/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Timestamp": timestamp,
            "Authorization": `Bearer ${process.env.ACCOUNT_KEY}`,
            "X-Api-Signature": apiSignature,
            "X-Account-Key": "account_key_" + process.env.ACCOUNT_KEY,
        },
        body: JSON.stringify(createAppData),
    });

    return response.json();
}


createNewAppUsingAccountKey().then((response) => {
    console.log(response);
});
