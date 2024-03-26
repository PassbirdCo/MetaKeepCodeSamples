import { checkEnvVariables, callAdminAPI } from "./utils.js";
import * as dotenv from "dotenv";
import fetchAppListByAccountKey from "./fetchAllApps.js";

dotenv.config();

checkEnvVariables();

const updateApp = async () => {
  const colorCodes = ["#FFBF00", "#6495ED", "#CCCCFF"];
  const updatedAppName = `UpdatedAppName - ${Math.floor(
    Math.random() * 10000
  )}`;
  const updateUserWalletFields = {
    displayName: `WalletDisplayName - ${Math.floor(Math.random() * 10000)}`,
    button: {
      backgroundColor:
        colorCodes[Math.floor(Math.random() * colorCodes.length)],
    },
    theme: { style: "DARK" },
    logoUrl: "https://metakeep.xyz/images/MetaKeep-1.png",
  };

  const requestBody = {
    appId: process.env.APP_ID,
    name: updatedAppName,
    userWallet: {
      ...updateUserWalletFields,
    },
  };

  const responseData = await callAdminAPI("/v2/app/update", requestBody);

  if (responseData.error) {
    throw new Error(responseData.error);
  } else {
    console.log("App updated successfully:", responseData);
  }
};

updateApp();
