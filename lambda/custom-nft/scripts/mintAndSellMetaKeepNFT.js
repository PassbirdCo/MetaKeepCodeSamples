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

  // Gets the user Address to whom you want to issue NFT.
  const userAddress = await getUserWallet(process.env.SELLER_EMAIL_ADDRESS);
  const tokenId = Math.floor(Math.random() * 10000);

  /* *************************************************************** Issue NFT *************************************************************** */
  console.log(
    "***************************************************** Issue NFT *****************************************************\n"
  );
  // Invokes the lambda function to mint NFT Token.
  console.log("Invoking lambda function to mint NFT...\n");
  const resultJson = await invoke("mint", [userAddress, tokenId], "mint-NFT");
  console.log("Lambda invocation for minting NFT initiated: \n");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for NFT issuance completed: " +
      resultJson.transactionHash +
      "\n"
  );

  // Waits for 5 seconds.
  sleep(5000);

  /* *************************************************************** Sell NFT *************************************************************** */
  console.log(
    "***************************************************** Sell NFT *****************************************************\n"
  );

  // Invokes the lambda function to sell NFT Token.
  console.log("Invoking lambda function to Sell NFT...\n");
  const resultJson2 = await invoke(
    "addForSale",
    [tokenId, 2000000000],
    "sell-nft"
  );
  console.log("Lambda invocation for selling NFT initiated: ");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson2);
  console.log(
    "Lambda invocation for placing nft for sale completed: " +
      resultJson2.transactionHash +
      "\n"
  );
}

main();
