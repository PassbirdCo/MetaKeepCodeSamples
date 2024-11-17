import {
  checkEnvVariables,
  callAdminAPI,
  fetchAppsByAccountKey,
} from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables(["APP_ID"]);

const getStats = async () => {
  // Find the app by ID
  const app = (await fetchAppsByAccountKey(process.env.APP_ID))[0];
  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }

  // Get logs
  const stats = await callAdminAPI(`/v2/app/stats`, {
    appId: app.appId,
    granularity: "HOURLY", // or "DAILY" or "MONTHLY"
  });

  console.log(stats);

  return stats;
};

getStats();
