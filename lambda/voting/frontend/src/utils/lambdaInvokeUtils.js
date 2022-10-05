import fetch from "node-fetch";

// This is the helper function to get the consent token by making request to the backend server.
export default async function getLambdaVotingConsentToken(
  candidateEmail,
  asEmail
) {
  console.log("Getting Lambda Consent token from backend...");
  const url = "http://localhost:3001/voteCandidate";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  const body = JSON.stringify({
    candidateEmail: candidateEmail,
    asEmail: asEmail,
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

// This is the helper function to register a candidate by making request to the backend server.
export const registerCandidature = async (candidateEmail) => {
  console.log("Registering Candidature for candidate: " + candidateEmail);
  const url = "http://localhost:3001/registerCandidature";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const body = JSON.stringify({
    candidateEmail: candidateEmail,
  });

  const options = {
    method: "POST",
    headers: headers,
    body: body,
  };

  const response = await fetch(url, options);
  const data = await response.json();
  console.log("Got RegisterCandidature response from backend: ");
  console.log(data);
  if (!response.ok) {
    console.log("Error getting RegisterCandidature response from backend: ");
  }
  console.log("\n");
  return data;
};
