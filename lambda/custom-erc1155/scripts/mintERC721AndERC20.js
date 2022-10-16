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

  // Gets the user Address to mint tokens.
  const userAddress = await getUserWallet(process.env.USER_EMAIL);

  /* ******************** Mint a NFT token to User ******************** */
  console.log(
    "******************** Mint a NFT token to User ********************"
  );
  // Invokes the lambda function to mint NFT to the user.
  console.log("Invoking lambda function to mint NFT user...\n");
  let nftId = 256;
  let nftData =
    "0x0100000000000000000000000000000000000000000000000000000000000000";
  const resultJson = await invoke(
    "mint",
    // since NFT is unique , the quantity of the token taken is one.
    [userAddress, nftId, 1, nftData],
    "Mint NFT token to User"
  );
  console.log(
    "Lambda invocation for minting NFT token to user is initiated: \n"
  );

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for minting NFT token to user is completed: " +
      resultJson.transactionHash +
      "\n"
  );

  // Waits for 5 seconds.
  sleep(5000);

  /* ******************** Mint ERC20 Token to User ******************** */
  console.log(
    "******************** Mint ERC20 Token to User ********************"
  );

  // Invokes the lambda function to mint ERC20 token for the user.
  console.log("Invoking lambda function to mint ERC20 token to the user\n");
  let tokenId = 1234;
  let quantity = 10000;
  let data =
    "0x0100000000000000000000000000000000000000000000000000000000000000";
  const resultJson2 = await invoke(
    "mint",
    [userAddress, tokenId, quantity, data],
    ""Mint ERC20 token to User""
  );
  console.log(
    "Lambda invocation for minting ERC20 token to user is initiated: "
  );

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson2);
  console.log(
    "Lambda invocation for minting ERC20 token to the user is completed: " +
      resultJson2.transactionHash +
      "\n"
  );
}

main();
