import env from "dotenv";
import { invoke } from "../../lambdaUtils.mjs";
import { solidityKeccak256 } from "ethers/lib/utils.js";
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

  // Gets the user Address to register as Candidate in Voting contract.
  const userAddress = await getUserWallet(process.env.REGISTER_CANDIDATE_EMAIL);

  /* *************************************************************** Upgrade contract *************************************************************** */
  console.log(
    "***************************************************** Upgrade contract *****************************************************\n"
  );
  // Invokes the lambda function to upgrade the contract.
  console.log("Invoking lambda function to upgrade contract...\n");
  const resultJson3 = await invoke("upgradeTo", ["0x2D9549E783Cde00AE781Dac40a0feDD84F86A25B"], "upgrade");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson3);
  console.log(
    "Lambda invocation for upgrading contract completed: " +
      resultJson3.transactionHash +
      "\n"
  );

  /* *************************************************************** Register Candidate *************************************************************** */
  console.log(
    "***************************************************** Register Candidate *****************************************************\n"
  );
  // Invokes the lambda function to register the user as candidate.
  console.log("Invoking lambda function to register candidate...\n");
  const resultJson = await invoke(
    "registerCandidate",
    [userAddress],
    "register"
  );
  console.log("Lambda invocation for registering user initiated: \n");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for registering user completed: " +
      resultJson.transactionHash +
      "\n"
  );

  // Waits for 5 seconds.
  sleep(5000);

  /* *************************************************************** Vote Candidate *************************************************************** */
  console.log(
    "***************************************************** Vote Candidate *****************************************************\n"
  );

  // Gets the Candidate ID to vote for the candidate.
  const candidateId = solidityKeccak256(["address"], [userAddress]);

  console.log("Candidate ID: " + candidateId + "\n")

  // Invokes the lambda function to vote for the candidate.
  console.log("Invoking lambda function to vote for candidate...\n");
  const resultJson2 = await invoke("voteForCandidate", [candidateId], "vote");
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
