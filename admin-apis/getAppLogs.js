import {
  checkEnvVariables,
  callAdminAPI,
  fetchAppsByAccountKey,
} from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables(["APP_ID"]);

const getAppLogs = async () => {
  // Find the app by ID
  const app = (await fetchAppsByAccountKey(process.env.APP_ID))[0];
  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }

  let logs = [];

  // Fetch logs until there are no more pages
  let paginationToken = null;

  do {
    const response = await callAdminAPI(`/v2/app/logs`, {
      appId: app.appId,
      pageSize: 10,
      paginationToken,
    });

    logs.push(...response.logs);
    paginationToken = response.paginationToken;
  } while (paginationToken);

  console.log("Number of logs:", logs.length);
  console.log("App logs:", logs);
};

getAppLogs();
