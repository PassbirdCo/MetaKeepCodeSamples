import {
  checkEnvVariables,
  callAdminAPI,
  fetchAppsByAccountKey,
} from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables(["APP_ID"]);

const getTransactionHistory = async () => {
  // Find the app by ID
  const app = (await fetchAppsByAccountKey(process.env.APP_ID))[0];
  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }

  // Get logs
  const history = await callAdminAPI(`/v2/app/transaction/history`, {
    appId: app.appId,
    pageSize: 10,
    paginationToken: null,
  });

  console.log(history);

  return history;
};

getTransactionHistory();
