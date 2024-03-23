import axios from "axios";
import { generateApiSignature } from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

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
          "Content-Type": "application/json",
          "X-Timestamp": timestamp,
          "X-Api-Signature": apiSignature,
          "X-Account-Key": "account_key_" + process.env.ACCOUNT_KEY,
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
