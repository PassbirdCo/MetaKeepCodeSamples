import {
  checkEnvVariables,
  callAdminAPI,
  fetchAppsByAccountKey,
} from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables(["APP_ID"]);

const deleteAllApiKeys = async () => {
  const app = (await fetchAppsByAccountKey(process.env.APP_ID))[0];

  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }

  // Get list of API keys of the app
  const deleteApiKeys = app.apiKeysInfo.apiKeys.map((apiKey) => {
    return { apiKey: apiKey.apiKey };
  });

  // Call the admin API to delete the API keys
  const requestBody = {
    appId: app.appId,
    apiKeys: {
      deleteApiKeys: deleteApiKeys,
    },
  };

  const responseData = await callAdminAPI("/v2/app/update", requestBody);

  return responseData;
};

deleteAllApiKeys().then((response) => {
  console.log("API Keys deleted successfully:", response);
});
