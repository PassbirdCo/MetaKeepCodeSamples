import fetch from "node-fetch";
export default async function getNftTransferConsentToken(
  tokenId,
  toEmail,
  fromEmail
) {
  console.log("Getting NFT transfer consent token from backend...");
  const url = "http://localhost:3001/getConsentToken";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  const requestBody = {
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
  console.log("getNftTransferConsentToken response: ");
  console.log(resultJson);
  if (!result.ok) {
    console.log("Error generating consent token for NFT transfer");
  }
  console.log("\n");
  return resultJson;
}
