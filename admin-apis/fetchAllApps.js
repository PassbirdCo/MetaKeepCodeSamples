import { checkEnvVariables, callAdminAPI } from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables();

const fetchAppListByAccountKey = async () => {
  try {
    const responseData = await callAdminAPI("/v2/app/list", {});
    return responseData.apps;
  } catch (error) {
    console.error("Error fetching app list:", error);
    throw error;
  }
};

export default fetchAppListByAccountKey;
