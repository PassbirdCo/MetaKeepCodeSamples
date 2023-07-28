// This is the helper function to get the consent token by making request to the backend server.
export default async function getLambdaStakingAndVotingConsentToken(
  proposalId,
  asEmail
) {
  console.log("Getting Lambda Consent token from backend...");
  const url = "http://localhost:3001/stakeAndVote";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  const body = JSON.stringify({
    proposalId: proposalId,
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

// This is the helper function to adding a proposal by making request to the backend server.
export const addProposal = async (proposalName, proposalDescription) => {
  console.log("Adding proposal " + proposalName);
  const url = "http://localhost:3001/addProposal";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const body = JSON.stringify({
    proposalName: proposalName,
    proposalDescription: proposalDescription,
  });

  const options = {
    method: "POST",
    headers: headers,
    body: body,
  };

  const response = await fetch(url, options);
  const data = await response.json();
  console.log("Got AddProposal response from backend: ");
  console.log(data);
  if (!response.ok) {
    console.log("Error getting AddProposal response from backend: ");
  }
  console.log("\n");
  return data;
};

// This is the helper function to adding a proposal by making request to the backend server.
export const getProposal = async (proposalId) => {
  console.log("Getting proposal: " + proposalId);
  const url = "http://localhost:3001/getProposal";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const body = JSON.stringify({
    proposalId: proposalId,
  });
  console.log(body);
  const options = {
    method: "POST",
    headers: headers,
    body: body,
  };

  const response = await fetch(url, options);
  const data = await response.json();
  console.log("Got getProposal response from backend: ");
  console.log(data);
  if (!response.ok) {
    console.log("Error getting getProposal response from backend: ");
  }
  console.log("\n");
  return data;
};
