// Script to deploy Smart contract using MetaKeep Lambda REST API.
import fs from "fs";
import env from "dotenv";
import { create, invoke, updateABI, getMergedABI } from "../../lambdaUtils.mjs";
import getDeveloperWallet, {
  checkAPIKey,
  waitUntilTransactionMined,
} from "../../../helpers/utils.mjs";

const newImplementationJson = JSON.parse(
  fs.readFileSync(
    "../smart-contracts/artifacts/contracts/CustomERC721UpgradeableV2.sol/CustomERC721UpgradeableV2.json"
  )
);

const proxyContractJson = JSON.parse(
  fs.readFileSync(
    "../smart-contracts/artifacts/contracts/CustomERC721Proxy.sol/CustomERC721Proxy.json"
  )
);

async function deployCustomERC721UpgradeableV2() {
  const developerAddress = await getDeveloperWallet();

  const resultJson = await create(
    ["MetaKeepOriginalsV2", "MTKP", developerAddress],
    newImplementationJson.abi,
    newImplementationJson.bytecode
  );

  // Wait for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);

  console.log(
    "Upgradeable ERC721 Lambda created successfully. Lambda address: " +
      resultJson.lambda
  );

  return resultJson.lambda;
}

async function upgradeToV2() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  // get the deployed lambda address
  const lambdaAddress = await deployCustomERC721UpgradeableV2();

  /* ******************** Upgrade To CustomERC721UpgradeableV2 ******************** */
  console.log(
    "******************** Upgrade To CustomERC721UpgradeableV2 ********************"
  );
  // Invokes the lambda function to upgrade the implementation contract.
  console.log(
    "Invoking lambda function to upgrade the implementation contract...\n"
  );
  const resultJson = await invoke(
    "upgradeTo",
    [lambdaAddress],
    "Upgrade To CustomERC721UpgradeableV2",
    process.env.CUSTOM_ERC721_PROXY_ADDRESS
  );
  console.log(
    "Lambda invocation for upgrading the CustomERC721UpgradeableV2 is initiated: \n"
  );

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for upgrading the CustomERC721Upgradeable is completed: " +
      resultJson.transactionHash +
      "\n"
  );

  /****************************** Update the ABI by calling lambda/update API **************** */
  console.log(
    "****************************** Update the ABI by calling lambda/update API ****************"
  );
  await updateABI(
    process.env.CUSTOM_ERC721_PROXY_ADDRESS,
    getMergedABI(newImplementationJson.abi, proxyContractJson.abi)
  );
}

upgradeToV2();
