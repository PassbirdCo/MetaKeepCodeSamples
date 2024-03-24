import { checkEnvVariables, generateApiSignature } from "./utils.js";
import axios from "axios";
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

  const timestamp = Date.now().toString();

  const requestBody = {
    appId: app.appId,
    name: updatedAppName,
    userWallet: {
      ...updateUserWalletFields,
    },
  };

  const apiSignature = await generateApiSignature(
    "POST",
    "/v2/app/update",
    null,
    timestamp,
    JSON.stringify(requestBody),
    process.env.ACCOUNT_KEY,
    process.env.ACCOUNT_SECRET,
  );

  await axios
    .post(`https://${process.env.API_ENDPOINT}/v2/app/update`, requestBody, {
      headers: {
        "X-Account-Key": process.env.ACCOUNT_KEY,
        "X-Api-Signature": apiSignature,
        "X-Timestamp": timestamp,
      },
    })
    .then((response) => {
      console.log("userWallet attributes updated successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error updating userWallet attributes:", error);
    });
};

updateAppUserWallet();
