// Script to deploy NFT contract using Metakeep Rest APIs

import fetch from "node-fetch";
import env from "dotenv";
import { exit } from "process";
import {
  sleep,
  waitUntilTransactionMined,
  checkAPIKey,
  getAPIHost,
  getDeveloperEvmAddress,
} from "../../helpers/utils.mjs";

async function createCollection() {
  const url = getAPIHost() + "/v2/app/nft/createCollection";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };

  const developerAddress = await getDeveloperEvmAddress();

  const requestBody = {
    nft: {
      name: "Metakeep_NFT",
      symbol: "MTKNFT",
    },
    metadata: {
      name: "Metakeep_NFT",
      description: "Metakeep_NFT",
      image:
        "https://cdn.pixabay.com/photo/2022/02/19/17/59/nft-7023209_960_720.jpg",
      external_link: "https://metakeep.xyz",
      seller_fee_basis_points: 1000,
      fee_recipient: developerAddress,
    },
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  console.log("Collection creation in process...");

  const result = await fetch(url, options);
  const resultJson = await result.json();

  console.log("Collection creation response:");

  console.log(resultJson);

  if (!result.ok) {
    // if the collection creation transaction is not Queued, logs the error and exits the program.
    console.log(
      "Collection creation failed. HTTP Status Code: " + resultJson.status
    );
    exit(1);
  }

  return resultJson;
}

async function mintNFT(collection) {
  const url = getAPIHost() + "/v2/app/nft/mint";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.floor(Math.random() * 10000),
  };

  const requestBody = {
    nft: {
      collection: collection,
    },
    to: {
      email: process.env.USER_EMAIL_ADDRESS,
    },
    metadata: {
      name: "Metakeep Tutorial NFT",
      description: "Metakeep Tutorial NFT",
      image:
        "https://cdn.pixabay.com/photo/2022/02/19/17/59/nft-7023209_960_720.jpg",
      external_url: "https://metakeep.xyz",
      attributes: [
        {
          trait_type: "Type",
          value: "Tutorial",
        },
      ],
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  console.log("NFT minting in process...");

  const result = await fetch(url, options);

  const resultJson = await result.json();

  console.log("NFT minting response:");

  console.log(resultJson);

  if (!result.ok) {
    // if the NFT minting transaction is not Queued, logs the error and exits the program.
    console.log("NFT minting failed. HTTP Status Code: " + resultJson.status);
    exit(1);
  }

  return resultJson;
}

async function main() {
  env.config();

  // check if the API key is set in the environment variables
  checkAPIKey();

  /* *************************************************************** Create Collection *************************************************************** */
  console.log(
    "***************************************************** Create Collection *****************************************************\n"
  );
  // Creates a New Collection
  console.log("Creating a new collection...");
  const resultJson = await createCollection();
  console.log("Collection creation in progress...");

  // Waits for the transaction to be mined
  await waitUntilTransactionMined(resultJson);
  console.log(
    "NFT Collection created successfully! Collection Address: " +
      resultJson.collection +
      "\n"
  );

  // Waits for 5 seconds.
  sleep(5000);

  /* *************************************************************** Mint NFT *************************************************************** */
  console.log(
    "***************************************************** Mint NFT *****************************************************\n"
  );

  // Mints a new NFT
  console.log("Minting a new NFT...");

  const collection = resultJson.collection;

  const mintResultJson = await mintNFT(collection);

  console.log("NFT mint in progress....");

  // Waits for the transaction to be mined

  await waitUntilTransactionMined(mintResultJson);

  console.log(
    "NFT minted successfully! Transaction Hash: " +
      mintResultJson.transactionHash
  );
  console.log("NFT Token Id:" + mintResultJson.token);
  console.log(
    "OpenSea Link (DEVELOPMENT): https://testnets.opensea.io/assets/mumbai/" +
      collection +
      "/" +
      mintResultJson.token
  );
  console.log(
    "OpenSea Link (PRODUCTION): https://opensea.io/assets/matic/" +
      collection +
      "/" +
      mintResultJson.token
  );
  console.log(
    "Note that OpenSea can take upto a minute to show the newly minted NFTs."
  );
}

main();
