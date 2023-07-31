import env from "dotenv";
import { invoke } from "../../lambdaUtils.mjs";
import {
  getDeveloperBusinessWallet,
  checkAPIKey,
} from "../../../helpers/utils.mjs";

const swapMaticForUSDC = async () => {
  env.config();

  //Checks if the API_KEY is set in the .env file.

  checkAPIKey();

  //invokes the swapExactETHForTokens method of the UniswapRouter contract.

  await invoke(
    "swapExactETHForTokens",
    [
      "1",
      [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
      await getDeveloperBusinessWallet(),
      // timestamp + 1 day
      String(Math.floor(Date.now() / 1000) + 86400),
    ],
    "Swapping Matic For USDC",
    process.env.SUSHISWAP_ROUTER_ADDRESS,
    "0.001",
    true
  );
};

swapMaticForUSDC();
