import axios from "axios";
import { generateApiSignature } from "./utils.js";
import * as dotenv from 'dotenv'

dotenv.config()

// Function to create a new app using the account key
const createNewAppUsingAccountKey = async () => {
    const timestamp = Date.now().toString();
    const appName = "MyApp";
    const createAppData = {
        blockchain: {
            chainId: "CHAIN_ID_POLYGON_MAINNET",
        },
        name: appName,
    }
    console.log(process.env.ACCOUNT_KEY, process.env.ACCOUNT_SECRET)
    // Generate API signature using the account key and secret
    const apiSignature = await generateApiSignature(
        "POST",
        "/v2/app/create",
        null,
        timestamp,
        JSON.stringify(createAppData),
        process.env.ACCOUNT_KEY,
        process.env.ACCOUNT_SECRET
    );

    // Send a POST request to create a new app using Axios
    const response = await axios.post(`https://${process.env.API_ENDPOINT}/v2/app/create`, createAppData, {
        headers: {
            "X-Timestamp": timestamp,
            "X-Api-Signature": apiSignature,
            "X-Account-Key": "account_key_" + process.env.ACCOUNT_KEY,
        },
    });

    // Return the response data
    return response.data;
}

// Call the createNewAppUsingAccountKey function and log the response
createNewAppUsingAccountKey().then((response) => {
    console.log(response);
});
