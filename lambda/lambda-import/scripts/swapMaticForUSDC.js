import env from "dotenv";
import { invokeInBatch } from "../../lambdaUtils.mjs";
import {
  getDeveloperBusinessWallet,
  checkAPIKey,
} from "../../../helpers/utils.mjs";

const swapMaticForUSDC = async () => {
  env.config();

  //Checks if the API_KEY is set in the .env file.

  checkAPIKey();

  //invokes the createPair method of the UniswapRouter contract.

  const invocations = [
    {
      call: {
        lambda: process.env.UNISWAP_ROUTER_ADDRESS,
        function: {
          name: "swapExactETHForTokens",
          args: [
            "1",
            [
              "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            ],
            process.env.RECIPIENT_ADDRESS || (await getDeveloperBusinessWallet()),
            "1690747536",
          ],
        },
        pay: "0.001",
        reason: "Swapping Matic For USDC",
      },
    },
  ];

  await invokeInBatch(invocations, "Swapping Matic For USDC");
};

swapMaticForUSDC();
