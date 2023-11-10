// Script to deploy Smart contract using Metakeep Lambda and REST API.
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
      "../smart-contracts/artifacts/contracts/Voting.sol/Voting.json",
    ),
  );
  const developerAddress = await getDeveloperEvmAddress();

  const resultJson = await create(
    [developerAddress, "Voting"],
    data.abi,
    data.bytecode,
  );

  //Waits for the transaction to be mined.

  await waitUntilTransactionMined(resultJson);

  console.log(
    "Lambda created successfully. Lambda address: " + resultJson.lambda,
  );
}

main();
