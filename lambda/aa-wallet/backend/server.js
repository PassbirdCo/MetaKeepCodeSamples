import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";
import { checkAPIKey, getUserWallet } from "../../../helpers/utils.mjs";

const app = express();

env.config();

checkAPIKey();

const port = 3001;

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.send("MetaKeep Tutorial Backend Server!");
});

/* ************************************************************************* Vote For Proposal API EndPoint ************************************************************************* */

app.post("/addProposal", async (req, res) => {
  console.log("getConsentToken");
  try {
    const result = await addProposal(
      req.body.proposalName,
      req.body.proposalDescription
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({
      error: error.message ? error.message : JSON.stringify(error),
    });
  }
});

/* ************************************************************************* Add Proposal API Endpoint ************************************************************************* */

app.post("/stakeAndVote", async (req, res) => {
  console.log("stakeAndVote");

  try {
    const result = await stakeAndVote(
      req.proposalId,
      req.body.asEmail,
      "StakeAndVote"
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({
      error: error.message ? error.message : JSON.stringify(error),
    });
  }
});

/* ************************************************************************* Get Proposal API Endpoint ************************************************************************* */

app.post("/getProposal", async (req, res) => {
  console.log("getProposal");

  try {
    console.log(req.body.proposalId);
    const result = await getProposalData(req.body.proposalId);
    res.send(result);
  } catch (error) {
    res.status(500).send({
      error: error.message ? error.message : JSON.stringify(error),
    });
  }
});

/* ************************************************************************* Start Server ************************************************************************* */

app.listen(port, () => {
  console.log(`Lambda Invocation server listening at http://localhost:${port}`);
});

/* ************************************************************************** Utility functions *************************************************************** */

// Utility function to add proposal using Lambda Invocation API.

async function addProposal(proposalName, proposalDescription) {
  console.log("Adding Proposal ...");

  //
  const requestBody = {
    invocations: [
      {
        call: {
          function: {
            name: "addProposal",
            args: [proposalName, proposalDescription],
          },
          lambda: process.env.VOTING_LAMBDA_ADDRESS,
          reason: "Adding Proposal",
        },
      },
    ],
    using: "BUSINESS_WALLET",
  };

  const outcome = await invokeLambdaFunction(requestBody);
  return outcome;
}
// Utility Function to add Proposal using Lambda Invocation API

async function stakeAndVote(proposalId, emailId, reason) {
  console.log("Adding Proposal ...");

  // since the "addProposalMethod takes the ethereum address as argument, we need to get the wallet associated with the emailId"

  const userWallet = await getUserWallet(emailId);
  const requestBody = {
    invocations: [
      {
        call: {
          function: {
            name: "stake",
          },
          pay: "0.1",
          reason: "Staking for the proposal",
          lambda: process.env.VOTING_LAMBDA_ADDRESS,
        },
      },
      {
        call: {
          function: {
            name: "vote",
            args: [userWallet, "1"],
          },
          reason: "Voting for the proposal",
          lambda: process.env.VOTING_LAMBDA_ADDRESS,
        },
      },
    ],
    using: "BUSINESS_WALLET",
    as: {
      email: emailId,
    },
  };

  const outcome = await invokeLambdaFunction(requestBody);
  return outcome;
}

// Utility function to get Proposal using Lambda Read API.
async function getProposalData(proposalId) {
  console.log("Getting the details for the proposal ...");
  /*
  This function takes the proposalId and the emailId as arguments.
  The emailId is used to get the wallet associated with the emailId.
  The proposalId is used to get the details of the proposal.
  */

  const requestBody = {
    function: {
      name: "getProposal",
      args: [proposalId],
    },
    lambda: process.env.VOTING_LAMBDA_ADDRESS,
  };

  const outcome = await readLambdaFunction(requestBody);
  return outcome;
}

// Utility function to invoke Lambda Function through MetaKeep Lambda Invocation API.

async function invokeLambdaFunction(requestBody) {
  const url = "https://api.dev.metakeep.xyz/v2/app/lambda/invoke/";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.random().toString(),
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  const result = await fetch(url, options);
  const resultJson = await result.json();
  console.log("Lambda Invocation response: ");
  console.log(resultJson);
  if (!result.ok) {
    console.log(
      "Error invoking Lambda Function. HTTP status code: " + result.status
    );
  }
  console.log("\n");
  return resultJson;
}

// Utility function to read from Lambda Function through MetaKeep Lambda Read API.

async function readLambdaFunction(requestBody) {
  const url = "https://api.dev.metakeep.xyz/v2/app/lambda/read/";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.random().toString(),
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  const result = await fetch(url, options);
  const resultJson = await result.json();
  console.log("Lambda Invocation response: ");
  console.log(resultJson);
  if (!result.ok) {
    console.log(
      "Error invoking Lambda Function. HTTP status code: " + result.status
    );
  }
  console.log("\n");
  return resultJson;
}
