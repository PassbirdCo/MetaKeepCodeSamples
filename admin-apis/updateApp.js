import { checkEnvVariables, callAdminAPI } from "./utils.js";
import * as dotenv from "dotenv";
import fetchAppListByAccountKey from "./fetchAllApps.js";

dotenv.config();

checkEnvVariables();

const updateAppUserWallet = async () => {
  const colorCodes = ["#FFBF00", "#6495ED", "#CCCCFF"];
  const updatedAppName = `appName - ${Math.floor(Math.random() * 10000)}`;
  const updateUserWalletFields = {
    displayName: `displayName - ${Math.floor(Math.random() * 10000)}`,
    button: {
      backgroundColor:
        colorCodes[Math.floor(Math.random() * colorCodes.length)],
    },
    theme: { style: "DARK" },
    logoUrl: "https://google.com",
  };

  const appList = await fetchAppListByAccountKey();
  const app = appList.find((app) => app.appId === process.env.APP_ID);

  const requestBody = {
    appId: app.appId,
    name: updatedAppName,
    userWallet: {
      ...updateUserWalletFields,
    },
  };

  const responseData = await callAdminAPI("/v2/app/update", requestBody);

  if (responseData.error) {
    throw new Error(responseData.error);
  }
  else {
    console.log("App updated successfully:", responseData);
  }
};

updateAppUserWallet();
