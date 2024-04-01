import { checkEnvVariables, callAdminAPI } from "./utils.js";
import * as dotenv from "dotenv";
import fetchAppListByAccountKey from "./fetchAllApps.js";

dotenv.config();

checkEnvVariables();

const findAppById = async (appId) => {
    const apps = await fetchAppListByAccountKey();
    const foundApp = apps.find((app) => app.appId === appId);
    
    return foundApp;
    };

const updateAppPolicy = async () => {
    const app = await findAppById(process.env.APP_ID);
    
    if (!app) {
        throw new Error(`App with ID ${process.env.APP_ID} not found`);
    }
    
    // Update the app policy
    const requestBody = {
        appId: app.appId,
        policy: {
            apiKeysOwnership : {
                quorum: {
                    members: [
                        {
                            type: "ACCOUNT_ADMIN"
                        },
                    ]
                }
            }
        }
    };

    const responseData = await callAdminAPI("/v2/app/update", requestBody);

    return responseData;

};

updateAppPolicy().then((response) => {
    console.log("App Policy updated successfully:", response);
});