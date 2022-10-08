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
      "../contracts/artifacts/contracts/MetaKeepCertificate.sol/MetaKeepCertificates.json"
    )
  );
  const developerAddress = await getDeveloperWallet();

  const resultJson = await create(
    ["MTKP", developerAddress, "MetaKeepCertificates"],
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
