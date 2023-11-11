// Script to deploy Smart contract using MetaKeep Lambda REST API.
import fs from "fs";
import env from "dotenv";
import { create } from "../../lambdaUtils.mjs";
import {
  checkAPIKey,
  waitUntilTransactionMined,
  getDeveloperEvmAddress,
} from "../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  const data = JSON.parse(
    fs.readFileSync(
      "../smart-contracts/artifacts/contracts/CustomERC721Upgradeable.sol/CustomERC721Upgradeable.json"
    )
  );
  const developerAddress = await getDeveloperEvmAddress();

  const resultJson = await create(
    ["MetaKeepOriginals", "MTKP", developerAddress],
    data.abi,
    data.bytecode
  );

  // Wait for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);

  console.log(
    "Upgradeable ERC721 Lambda created successfully. Lambda address: " +
      resultJson.lambda
  );
}

main();
