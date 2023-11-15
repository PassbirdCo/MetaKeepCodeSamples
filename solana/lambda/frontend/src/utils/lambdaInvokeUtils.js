// This is the helper function to get the consent token by making request to the backend server.
export default async function getLambdaMemoInvokeConsentToken(
  asEmail,
  message,
  multipleInvocation
) {
  console.log("Getting Lambda Consent token from backend...");
  const url = "http://localhost:3001/logMemoForEndUser";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  const body = JSON.stringify({
    asEmail: asEmail,
    message: message,
    multipleInvocation: multipleInvocation,
  });

  const options = {
    method: "POST",
    headers: headers,
    body: body,
  };

  const response = await fetch(url, options);
  const data = await response.json();
  console.log("Got Lambda Consent token from backend: ");
  console.log(data);
  if (!response.ok) {
    console.log("Error getting Lambda Consent token from backend: ");
  }
  console.log("\n");
  return data;
}
