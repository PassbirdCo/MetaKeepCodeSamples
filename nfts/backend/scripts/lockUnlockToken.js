// Script to lock and unlock NFT token using MetaKeep REST APIs

import fetch from "node-fetch";
import env from "dotenv";
import { exit } from "process";
import getDeveloperWallet, {
  sleep,
  waitUntilTransactionMined,
  checkAPIKey,
} from "../../../helpers/utils.mjs";

async function lockUnlockToken(
  // lock or unlock
  type
) {
  let url;

  if (type == "unlock") {
    url = "https://api.metakeep.xyz/v2/app/nft/unlock";
  } else if (type == "lock") {
    url = "https://api.metakeep.xyz/v2/app/nft/lock";
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };

  const requestBody = {
    nft: {
      collection: process.env.COLLECTION,
    },
    token: process.env.TOKEN_ID,
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };

  console.log("Token " + type + " in process...");

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log("Token " + type + " response:");

  console.log(resultJson);

  if (!result.ok) {
    // if the token lock transaction is not Queued, logs the error and exits the program.
    console.log(
      "Token " + type + " failed. HTTP Status Code: " + resultJson.status
    );
    exit(1);
  }

  return resultJson;
}

async function main() {
  env.config();

  // check if the API key is set in the environment variables
  checkAPIKey();

  /* ********************************************************* Lock Token ********************************************************* */
  console.log(
    "**************************************************** Lock Token ****************************************************"
  );

  // lock token
  console.log("Locking token...");
  const lockTokenJSON = await lockUnlockToken("lock");
  console.log("Locking token in progress...");

  // wait until the transaction is mined
  await waitUntilTransactionMined(lockTokenJSON);
  console.log(
    "Token locked successfully. Transaction hash: " +
      lockTokenJSON.transactionHash
  );

  /* ********************************************************* Unlock Token ********************************************************* */

  console.log(
    "**************************************************** Unlock Token ****************************************************"
  );

  // unlock token
  console.log("Unlocking token...");

  const unlockTokenJSON = await lockUnlockToken("unlock");

  console.log("Unlocking token in progress...");

  // wait until the transaction is mined

  await waitUntilTransactionMined(unlockTokenJSON);

  console.log(
    "Token unlocked successfully. Transaction hash: " +
      unlockTokenJSON.transactionHash
  );
}

main();
