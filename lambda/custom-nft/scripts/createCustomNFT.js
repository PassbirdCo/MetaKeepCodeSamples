// Script to deploy Smart contract using Metakeep Lambda and REST API.
import fs from "fs";
import env from "dotenv";
import { create } from "../../lambdaUtils.mjs";
import getDeveloperWallet, {
  checkAPIKey,
  waitUntilTransactionMined,
} from "../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  const data = JSON.parse(
    fs.readFileSync(
      "../contracts/artifacts/contracts/MetaKeepNFT.sol/MetaKeepNFT.json"
    )
  );
  const developerAddress = await getDeveloperWallet();
  console.log(developerAddress);
  const resultJson = await create(
    [
      "MTKP",
      developerAddress,
      "metakeepnft",
      process.env.METAKEEP_ERC20_CONTRACT_ADDRESS,
    ],
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
