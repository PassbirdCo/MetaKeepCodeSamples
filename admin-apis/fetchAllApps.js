import { checkEnvVariables, callAdminAPI } from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables();

const fetchAppListByAccountKey = async () => {
  const responseData = await callAdminAPI("/v2/app/list", {});
  return responseData.apps;
};

export default fetchAppListByAccountKey;
