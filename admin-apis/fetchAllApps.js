import axios from "axios";
import { checkEnvVariables, generateApiSignature } from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables();

const fetchAppListByAccountKey = async () => {
  const timestamp = Date.now().toString();

  try {
    const apiSignature = await generateApiSignature(
      "POST",
      "/v2/app/list",
      null,
      timestamp,
      "",
      process.env.ACCOUNT_KEY,
      process.env.ACCOUNT_SECRET,
    );

    const response = await axios.get(
      `https://${process.env.API_ENDPOINT}/v2/app/list`,
      {
        headers: {
          "content-type": "application/json",
          "x-timestamp": timestamp,
          "x-api-signature": apiSignature,
          "x-account-key": process.env.ACCOUNT_KEY,
        },
      },
    );
    return response.data.apps;
  } catch (error) {
    console.error("Error fetching app list:", error);
    throw error;
  }
};

export default fetchAppListByAccountKey;
