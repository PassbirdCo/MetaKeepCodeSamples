import {
  checkEnvVariables,
  callAdminAPI,
  fetchAppsByAccountKey,
} from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables(["APP_ID"]);

const getAppStats = async () => {
  // Find the app by ID
  const app = (await fetchAppsByAccountKey(process.env.APP_ID))[0];
  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }

  // Get app stats
  const stats = await callAdminAPI(`/v2/app/stats`, {
    appId: app.appId,
    granularity: "HOURLY", // or "DAILY" or "MONTHLY"
  });

  console.log("App stats:", stats);
};

getAppStats();
