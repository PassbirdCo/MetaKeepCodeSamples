import { generateApiSignature } from "./utils.js";
import axios from "axios";
import * as dotenv from "dotenv";
import fetchAppListByAccountKey from "./fetchAllApps.js";

dotenv.config();

const deleteAllApiKeys = async (accountKey, accountSecret) => {
  const { apps } = await fetchAppListByAccountKey();
  const initialApp = apps[0];
  const timestamp = Date.now().toString();

  const deleteApiKeys = initialApp.apiKeysInfo.apiKeys.map((apiKey) => {
    return { api_key: apiKey.apiKey };
  });

  const requestBody = {
    app_id: initialApp.appId,
    api_keys: {
      delete_api_keys: deleteApiKeys,
    },
  };

  const apiSignature = await generateApiSignature(
    "POST",
    "/v2/app/update",
    null,
    timestamp,
    JSON.stringify(requestBody),
    accountKey,
    accountSecret,
  );

  const response = await axios.post(
    `https://${process.env.API_ENDPOINT}/v2/app/update`,
    requestBody,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Timestamp": timestamp,
        "X-Api-Signature": apiSignature,
        "X-Account-Key": "account_key_" + accountKey,
      },
    },
  );

  return response.data; // Return response data
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
