import env from "dotenv";
import { invoke } from "../../lambdaUtils.mjs";
import {
  waitUntilTransactionMined,
  getUserWallet,
  sleep,
  checkAPIKey,
} from "../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  // Gets the user Address to whom you want to issue certificate.
  const userAddress = await getUserWallet(process.env.CANDIDATE_EMAIL);
  const tokenId = Math.floor(Math.random() * 10000);

  /* *************************************************************** Issue Certificate *************************************************************** */
  console.log(
    "***************************************************** Issue Certificate *****************************************************\n"
  );
  // Invokes the lambda function to issue certifcate.
  console.log("Invoking lambda function to issue certificate...\n");
  const resultJson = await invoke(
    "mint",
    [
      userAddress,
      tokenId,
      "MetaKeepUser" + String(tokenId),
      process.env.CANDIDATE_EMAIL,
    ],
    "issue-certificate"
  );
  console.log("Lambda invocation for issuing certificate initiated: \n");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for certificate issuance completed: " +
      resultJson.transactionHash +
      "\n"
  );

  // Waits for 5 seconds.
  sleep(5000);

  /* *************************************************************** Destroy Certificate *************************************************************** */
  console.log(
    "***************************************************** Destory Certificate *****************************************************\n"
  );

  // Invokes the lambda function to vote for the candidate.
  console.log("Invoking lambda function to destroy certificate...\n");
  const resultJson2 = await invoke("destroy", [tokenId], "destroy-certificate");
  console.log("Lambda invocation for voting initiated: ");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson2);
  console.log(
    "Lambda invocation for voting completed: " +
      resultJson2.transactionHash +
      "\n"
  );
}

main();
