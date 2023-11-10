// Script to deploy Smart contract using Metakeep Lambda and REST API.
import fs from "fs";
import env from "dotenv";
import { create } from "../../lambdaUtils.mjs";
import getEvmDeveloperWallet, {
  checkAPIKey,
  waitUntilTransactionMined,
} from "../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  const data = JSON.parse(
    fs.readFileSync(
      "../smart-contracts/artifacts/contracts/CustomERC1155.sol/CustomERC1155.json"
    )
  );
  const developerAddress = await getEvmDeveloperWallet();

  const resultJson = await create(
    ["Enter Your URI", developerAddress, "Custom ERC1155"],
    data.abi,
    data.bytecode
  );

  //Waits for the transaction to be mined.

  await waitUntilTransactionMined(resultJson);

  console.log(
    "Lambda created successfully. Lambda address: " + resultJson.lambda
  );
}

main();
