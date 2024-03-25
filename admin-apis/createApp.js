import { callAdminAPI, checkEnvVariables } from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables(false);

// Function to create a new app using the account key
const createNewApp = async () => {
  const appName = "MyApp";
  const createAppData = {
    blockchain: {
      chainId: "CHAIN_ID_SOLANA_DEVNET",
    },
    name: appName,
  };

  const responseData = await callAdminAPI("/v2/app/create", createAppData);

  // Return the response data
  return responseData;
};

// Call the createNewApp function and log the response
createNewApp().then((response) => {
  console.log(response);
});
