import {
  checkEnvVariables,
  callAdminAPI,
  fetchAppsByAccountKey,
} from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables(["APP_ID"]);

const getAppTransactionHistory = async () => {
  // Find the app by ID
  const app = (await fetchAppsByAccountKey(process.env.APP_ID))[0];
  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }

  let transactionHistory = [];

  // Fetch transaction history until there are no more pages
  let paginationToken = null;

  do {
    const history = await callAdminAPI(`/v2/app/transaction/history`, {
      appId: app.appId,
      pageSize: 10,
      paginationToken: paginationToken,
    });

    transactionHistory.push(...history.transactions);
    paginationToken = history.paginationToken;
  } while (paginationToken);

  console.log("Number of transactions:", transactionHistory.length);
  console.log("Transactions:", transactionHistory);
};

getAppTransactionHistory();
