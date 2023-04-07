import env from "dotenv";
import { invoke } from "../../lambdaUtils.mjs";
import {
  waitUntilTransactionMined,
  getUserWallet,
  sleep,
  checkAPIKey,
} from "../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  // Gets the user Address to whitelist in NFT collection contract.
  const userAddress = await getUserWallet(process.env.USER_EMAIL);

  /* ******************** Whitelist User ******************** */
  console.log("******************** Whitelist User ********************");
  // Invokes the lambda function to whitelist the user.
  console.log("Invoking lambda function to whitelist user...\n");
  const resultJson = await invoke(
    "addToWhitelist",
    [userAddress],
    "Whitelist User",
    process.env.CUSTOM_ERC721_PROXY_ADDRESS
  );
  console.log("Lambda invocation for whitelisting user is initiated: \n");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for whitelisting user is completed: " +
      resultJson.transactionHash +
      "\n"
  );

  // Waits for 5 seconds.
  sleep(5000);

  /* ******************** Mint Token to Whitelisted User ******************** */
  console.log(
    "******************** Mint Token to Whitelisted User ********************"
  );

  // Invokes the lambda function to mint token for the user.
  console.log("Invoking lambda function to mint NFT token to the user\n");
  const resultJson2 = await invoke(
    "mint",
    [userAddress, "1234"],
    "mint token",
    process.env.CUSTOM_ERC721_PROXY_ADDRESS
  );
  console.log("Lambda invocation for minting token to user is initiated: ");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson2);
  console.log(
    "Lambda invocation for minting token to the user is completed: " +
      resultJson2.transactionHash +
      "\n"
  );
}

main();
