import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";
import { checkAPIKey, getUserWallet } from "../../../../helpers/utils.mjs";
import { invokeMultiple, invoke, readLambda } from "../../../lambdaUtils.mjs";

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

/* ************************************************************************* Add proposal API EndPoint ************************************************************************* */

app.post("/addProposal", async (req, res) => {
  console.log("addProposal");
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

/* ************************************************************************* Stake and Vote API Endpoint ************************************************************************* */

app.post("/stakeAndVote", async (req, res) => {
  console.log("stakeAndVote");

  try {
    const result = await stakeAndVote(
      req.body.proposalId,
      req.body.asEmail,
      "stake and vote for the proposal " + req.body.proposalId
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

    const result = await readLambda(
      process.env.VOTING_LAMBDA_ADDRESS,
      "getProposal",
      [req.body.proposalId]
    );
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

  return await invoke(
    "addProposal",
    [proposalName, proposalDescription],
    "Adding Proposal",
    process.env.VOTING_LAMBDA_ADDRESS,
    null,
    true
  );
}
// Utility Function to stake and vote using Lambda Invocation API.
async function stakeAndVote(proposalId, emailId, reason) {
  console.log("Staking and Voting for the proposal ...");

  const outcome = await invokeMultiple(
    [
      {
        call: {
          function: {
            name: "stake",
          },
          pay: "0.1",
          reason: "Stake 0.1 MATIC for the proposal",
          lambda: process.env.VOTING_LAMBDA_ADDRESS,
        },
      },
      {
        call: {
          function: {
            name: "vote",
            args: [proposalId],
          },
          reason: "Vote for the proposal",
          lambda: process.env.VOTING_LAMBDA_ADDRESS,
        },
      },
    ],
    reason,
    { email: emailId }
  );
  return outcome;
}
