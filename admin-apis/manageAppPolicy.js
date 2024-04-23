import axios from "axios";
import {
  checkEnvVariables,
  callAdminAPI,
  fetchAppsByAccountKey,
} from "./utils.js";
import * as dotenv from "dotenv";

dotenv.config();

checkEnvVariables(["APP_ID", "APP_POLICY_QUORUM_MEMBER_EMAIL"]);

const updateAppPolicy = async () => {
  const app = (await fetchAppsByAccountKey(process.env.APP_ID))[0];

  if (!app) {
    throw new Error(`App with ID ${process.env.APP_ID} not found`);
  }

  // We will create an app policy with a quorum having 2 members
  // 1. Account Admin
  // 2. Sol address corresponding to the email provided in the environment variable. We can
  // use any other sol address( e.g. sol address from user's external ledger hardware wallet). However,
  // using an email provides an easier recovery mechanism for the user without compromising security.

  // Get the sol address corresponding to the email
  const response = await axios.post(
    `https://${process.env.API_ENDPOINT}/v3/getWallet`,
    {
      user: {
        email: process.env.APP_POLICY_QUORUM_MEMBER_EMAIL,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-App-Id": process.env.APP_ID,
      },
    }
  );
  const solAddress = response.data.wallet.solAddress;

  console.log("Sol address for the email:", solAddress);

  // Update the app policy
  const requestBody = {
    appId: app.appId,
    policy: {
      apiKeysOwnership: {
        quorum: {
          members: [
            {
              type: "ACCOUNT_ADMIN",
            },
            {
              type: "SOL_ADDRESS",
              publicKey: solAddress,
            },
          ],
        },
      },
    },
  };

  const responseData = await callAdminAPI("/v2/app/update", requestBody);

  return responseData;
};

updateAppPolicy().then((response) => {
  console.log("App Policy updated successfully:", response);
  console.log(
    "Now try to add an API key to verify the app policy by running `npm run addApiKey`. The API key addition should fail."
  );
});
