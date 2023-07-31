import env from "dotenv";
import { invoke } from "../../../lambdaUtils.mjs";
import {
  getDeveloperBusinessWallet,
  checkAPIKey,
  waitUntilTransactionMined,
} from "../../../../helpers/utils.mjs";

const swapMaticForUSDC = async () => {
  env.config();

  //Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  console.log("Swapping Matic for USDC...");

  //invokes the swapExactETHForTokens method of the SushiSwapRouter contract.
  const resultJson = await invoke(
    "swapExactETHForTokens",
    [
      //minimum amount in wei that you would want to receive in exchange for the Matic.
      "1",
      [
        //WMatic token address
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        //USDC token address
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
      //address of the wallet that will receive the USDC tokens.
      await getDeveloperBusinessWallet(),
      // timestamp + 1 day
      String(Math.floor(Date.now() / 1000) + 86400),
    ],
    "Swap Matic For USDC",
    process.env.SUSHISWAP_ROUTER_ADDRESS,
    // Swap 0.001 Matic for USDC
    "0.001",
    // Only business wallet can send a payment.
    true
  );

  // Waits for the transaction to be mined.
  waitUntilTransactionMined(resultJson);
};

swapMaticForUSDC();
