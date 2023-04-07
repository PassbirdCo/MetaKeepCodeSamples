// Script to deploy Smart contract using Metakeep Lambda and REST API.
import fs from "fs";
import env from "dotenv";
import { create } from "../../lambdaUtils.mjs";
import getDeveloperWallet, {
  checkAPIKey,
  waitUntilTransactionMined,
} from "../../../helpers/utils.mjs";
import Web3 from "web3";

function getMergedABI(implementationABI, proxyABI) {
  // Remove constructor from implementation ABI
  const abi = implementationABI.filter((item) => {
    return item.type !== "constructor";
  });
  const mergedABI = abi.concat(proxyABI);
  return mergedABI;
}

function getInitializeData(implementationABI, lambdaName, developerAddress) {
  const web3 = new Web3();
  const initializeABI = implementationABI.find(
    (item) => item.name === "initialize"
  );
  const initalizationParameters = [lambdaName, "MTKP", developerAddress];

  return web3.eth.abi.encodeFunctionCall(
    initializeABI,
    initalizationParameters
  );
}

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  const data = JSON.parse(
    fs.readFileSync(
      "../smart-contracts/artifacts/contracts/CustomERC721Proxy.sol/CustomERC721Proxy.json"
    )
  );

  const implementationABI = JSON.parse(
    fs.readFileSync(
      "../smart-contracts/artifacts/contracts/CustomERC721Upgradeable.sol/CustomERC721Upgradeable.json"
    )
  ).abi;

  const developerAddress = await getDeveloperWallet();

  const lambdaName = "MetaKeep Originals";

  const resultJson = await create(
    [
      developerAddress,
      lambdaName,
      process.env.CUSTOM_ERC721_UPGRADEABLE_CONTRACT_ADDRESS,
      getInitializeData(implementationABI, lambdaName, developerAddress),
    ],
    getMergedABI(implementationABI, data.abi),
    data.bytecode
  );

  //Waits for the transaction to be mined.

  await waitUntilTransactionMined(resultJson);

  console.log(
    "Lambda created successfully. Lambda address: " + resultJson.lambda
  );
}

main();
