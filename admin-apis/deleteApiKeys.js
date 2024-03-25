import { checkEnvVariables, callAdminAPI } from "./utils.js";
import * as dotenv from "dotenv";
import fetchAppListByAccountKey from "./fetchAllApps.js";

dotenv.config();

checkEnvVariables();

const deleteAllApiKeys = async (accountKey, accountSecret) => {
  const apps = await fetchAppListByAccountKey();
  const initialApp = apps[0];

  const deleteApiKeys = initialApp.apiKeysInfo.apiKeys.map((apiKey) => {
    return { apiKey: apiKey.apiKey };
  });

  const requestBody = {
    appId: initialApp.appId,
    apiKeys: {
      deleteApiKeys: deleteApiKeys,
    },
  };

  const responseData = await callAdminAPI("/v2/app/update", requestBody);

  return responseData; // Return response data
};

const accountKey = process.env.ACCOUNT_KEY;
const accountSecret = process.env.ACCOUNT_SECRET;

deleteAllApiKeys(accountKey, accountSecret)
  .then((response) => {
    console.log("API Keys deleted successfully:", response);
  })
  .catch((error) => {
    console.error("Error deleting API Keys:", error);
  });
