import env from "dotenv";
import fetch from "node-fetch";
import { importLambda } from "../../../lambdaUtils.mjs";
import { checkAPIKey } from "../../../../helpers/utils.mjs";

async function getABI() {
  const response = await fetch(
    "https://api.polygonscan.com/api?module=contract&action=getabi&address=" +
      process.env.SUSHISWAP_ROUTER_ADDRESS
  );

  const data = await response.json();
  console.log(data.result);
  return data.result;
}
async function main() {
  env.config();

  //Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  const address = process.env.SUSHISWAP_ROUTER_ADDRESS;

  const abi_r = await getABI();

  await importLambda(JSON.parse(abi_r), "SushiSwapV2Router02", address);
}

main();
