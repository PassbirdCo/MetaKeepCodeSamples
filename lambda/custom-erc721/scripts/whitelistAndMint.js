import env from "dotenv";
import { invoke } from "../../lambdaUtils.mjs";
import { solidityKeccak256 } from "ethers/lib/utils.js";
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

  /* ******************** Mint Token to User ******************** */
  console.log(
    "******************** Mint Token to User ********************"
  );

  // Invokes the lambda function to mint token for the user.
  console.log("Invoking lambda function to mint NFT token to the user\n");
  const resultJson2 = await invoke("mint", [userAddress, "1234"], "mint token");
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
