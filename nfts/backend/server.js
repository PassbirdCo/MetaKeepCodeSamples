import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";
import { checkAPIKey } from "../../helpers/utils.mjs";

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

app.post("/getConsentToken", async (req, res) => {
  console.log("getConsentToken");
  const result = await getNftTransferConsentToken(
    req.body.token,
    req.body.to.email,
    req.body.from.email
  );
  res.send(result);
});
app.listen(port, () => {
  console.log(`NFT transfer server listening at http://localhost:${port}`);
});

// Utility function to transfer NFT

async function getNftTransferConsentToken(tokenId, toEmail, fromEmail) {
  console.log("Get transfer NFT consent token...");
  const url = "https://api.metakeep.xyz/v2/app/nft/transfer/";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.API_KEY,
    "Idempotency-Key": "Idempotency-Key" + Math.random().toString(),
  };
  const requestBody = {
    nft: {
      collection: process.env.COLLECTION,
    },
    token: tokenId,
    to: {
      email: toEmail,
    },
    from: {
      email: fromEmail,
    },
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  const result = await fetch(url, options);
  const resultJson = await result.json();
  console.log("TransferNFT response: ");
  console.log(resultJson);
  if (!result.ok) {
    console.log("Error transferring NFT");
  }
  console.log("\n");
  return resultJson;
}
