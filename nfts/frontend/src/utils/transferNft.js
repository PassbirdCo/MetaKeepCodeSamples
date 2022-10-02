import fetch from "node-fetch";
export default async function TransferNFTService(tokenId, toEmail, fromEmail) {
  console.log("Transferring NFT...");
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
  console.log("TransferNFT response: ");
  console.log(resultJson);
  if (!result.ok) {
    console.log("Error transferring NFT");
  }
  console.log("\n");
  return resultJson;
}
