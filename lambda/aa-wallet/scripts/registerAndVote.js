import env from "dotenv";
import { invoke, invokeInBatch } from "../../lambdaUtils.mjs";
import { solidityKeccak256 } from "ethers/lib/utils.js";
import getDeveloperWallet, {
  waitUntilTransactionMined,
  getUserWallet,
  sleep,
  checkAPIKey,
} from "../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  const developerAddress = await getDeveloperWallet();

  /* *************************************************************** Register Proposal *************************************************************** */
  console.log(
    "***************************************************** Register Proposal *****************************************************\n"
  );
  // Invokes the lambda function to register the user as Proposal.
  console.log("Invoking lambda function to register proposal...\n");
  const resultJson = await invokeInBatch(
    [
      {
        call: {
          function: {
            name: "addProposal",
            args: ["Proposal Name", "Proposal Description"],
          },
          reason: "Registering the proposal",
          lambda: process.env.LAMBDA_ADDRESS,
        },
      }
    ]
  );
  console.log("Lambda invocation for registering proposal initiated: \n");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for registering user completed: " +
      resultJson.transactionHash +
      "\n"
  );

  // Waits for 5 seconds.
  sleep(5000);

  /* *************************************************************** Stake And Vote *************************************************************** */
  console.log(
    "***************************************************** Stake And Vote *****************************************************\n"
  );

  // Invokes the lambda function to vote and stake.
  console.log("Invoking lambda to state and vote for proposal...\n");
  const resultJson2 = await invokeInBatch([
    {
      call: {
        function: {
          name: "stake",
        },
        pay: "0.1",
        reason: "Staking for the proposal",
        lambda: process.env.LAMBDA_ADDRESS,
      },
    },
    {
      call: {
        function: {
          name: "vote",
          args: [developerAddress, "1"]
        },
        reason: "Voting for the proposal",
        lambda: process.env.LAMBDA_ADDRESS,
      }
    }
  ]);
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
