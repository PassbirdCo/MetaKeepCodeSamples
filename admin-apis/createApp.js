import axios from "axios";
import { generateApiSignature, checkEnvVariables } from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables(false);

// Function to create a new app using the account key
const createNewApp = async () => {
  const timestamp = Date.now().toString();
  const appName = "MyApp";
  const createAppData = {
    blockchain: {
      chainId: "CHAIN_ID_SOLANA_DEVNET",
    },
    name: appName,
  };

  // Generate API signature using the account key and secret
  const apiSignature = await generateApiSignature(
    "POST",
    "/v2/app/create",
    null,
    timestamp,
    JSON.stringify(createAppData),
    process.env.ACCOUNT_KEY,
    process.env.ACCOUNT_SECRET,
  );

  // Send a POST request to create a new app using Axios
  const response = await axios.post(
    `https://${process.env.API_ENDPOINT}/v2/app/create`,
    createAppData,
    {
      headers: {
        "X-Timestamp": timestamp,
        "X-Api-Signature": apiSignature,
        "X-Account-Key": process.env.ACCOUNT_KEY,
      },
    },
  );

  // Return the response data
  return response.data;
};

// Call the createNewApp function and log the response
createNewApp().then((response) => {
  console.log(response);
});
