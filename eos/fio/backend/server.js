import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";

const app = express();

env.config();

if (!process.env.FIO_API_TOKEN) {
  console.log("FIO_API_TOKEN environment variable not set.");
  process.exit(1);
}

if (!process.env.FIO_REFERRAL_CODE) {
  console.log("FIO_REFERRAL_CODE environment variable not set.");
  process.exit(1);
}

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

/* ************************************************************************* Start Server ************************************************************************* */

app.listen(port, () => {
  console.log(`Metakeep FIO server listening at http://localhost:${port}`);
});

/* ************************************************************************* Root API Endpoint ************************************************************************* */

app.get("/", (_, res) => {
  res.send("MetaKeep FIO Tutorial Backend Server!");
});

/* ************************************************************************* Buy handle API EndPoint ************************************************************************* */

app.post("/buyHandle", async (req, res) => {
  console.log("buyHandle handler running...");
  let result;
  try {
    result = await buyFIOHandle({
      address: req.body.fioHandle,
      publicKey: req.body.fioPublicKey,
      referralCode: process.env.FIO_REFERRAL_CODE,
      apiToken: process.env.FIO_API_TOKEN,
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({
      error: error.message ? error.message : JSON.stringify(error),
    });
  }
});

/* ************************************************************************** Utility functions *************************************************************** */

// Utility function to invoke buy handle FIO API.
async function buyFIOHandle(requestBody) {
  const url = `${process.env.FIO_REGISTRATION_API_BASE_URL}/buy-address`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "*/*",
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };
  const result = await fetch(url, options);

  if (!result.ok) {
    console.error(
      "Error invoking buy handle. HTTP status code: " + result.status
    );

    const resultJson = await result.json();

    console.error(resultJson);

    throw new Error(
      "Error invoking buy handle. HTTP status code: " +
        result.status +
        ", Response: " +
        JSON.stringify(resultJson)
    );
  }
  const resultJson = await result.json();

  console.log("FIO buy handle response:");
  console.log(resultJson);

  console.log("\n");
  return resultJson;
}
