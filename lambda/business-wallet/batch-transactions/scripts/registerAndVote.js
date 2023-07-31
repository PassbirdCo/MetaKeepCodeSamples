import env from "dotenv";
import { invokeMultiple } from "../../../lambdaUtils.mjs";
import {
  waitUntilTransactionMined,
  checkAPIKey,
} from "../../../../helpers/utils.mjs";

async function main() {
  env.config();

  // Checks if the API_KEY is set in the .env file.
  checkAPIKey();

  /* *************************************************************** Register a proposal, Stake And Vote *************************************************************** */
  console.log(
    "***************************************************** Register a proposal, Stake And Vote *****************************************************\n"
  );

  // Invokes the lambda function to vote and stake.
  console.log(
    "Invoking lambda to register, state, and vote for a proposal...\n"
  );
  const resultJson = await invokeMultiple(
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
      },
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
            args: ["1"],
          },
          reason: "Voting for the proposal",
          lambda: process.env.LAMBDA_ADDRESS,
        },
      },
    ],
    "Stake And Vote"
  );
  console.log("Lambda invocation for voting initiated: ");

  // Waits for the transaction to be mined.
  await waitUntilTransactionMined(resultJson);
  console.log(
    "Lambda invocation for voting completed: " +
      resultJson.transactionHash +
      "\n"
  );
}

main();
