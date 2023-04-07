// Script to deploy Smart contract using Metakeep Lambda and REST API.
import fs from "fs";
import env from "dotenv";
import { create } from "../../lambdaUtils.mjs";
import getDeveloperWallet, {
  checkAPIKey,
  waitUntilTransactionMined,
} from "../../../helpers/utils.mjs";

import { ethers } from "ethers";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  const data = JSON.parse(
    fs.readFileSync(
      "../smart-contracts/artifacts/contracts/VotingUpgradeable.sol/VotingUpgradeable.json"
    )
  );
  const developerAddress = await getDeveloperWallet();
  const functionSignature = "initalize(address,string)"
  const functionParams = [developerAddress, "Proxy"]
  const functionParamsTypes = ["address", "string"]
  const functionParamsEncoded = ethers.utils.defaultAbiCoder.encode(functionParamsTypes, functionParams)
  const function_data = ethers.utils.concat([ethers.utils.hexZeroPad("0x", + functionSignature.toString("hex"), 4), functionParamsEncoded]);
  console.log(function_data)
  const resultJson = await create(
    [developerAddress, "Voting"],
    data.abi,
    data.bytecode
  );

  console.log(resultJson)

  //Waits for the transaction to be mined.

  await waitUntilTransactionMined(resultJson);

  console.log(
    "Lambda created successfully. Lambda address: " + resultJson.lambda
  );
}

main();
