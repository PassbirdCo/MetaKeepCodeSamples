import React, { useState } from "react";
import getLambdaStakingAndVotingConsentToken, {
  getProposal,
} from "../../utils/lambdaInvokeUtils";
import "./StakingAndVoting.css";

export const StakingAndVoting = ({ sdk }) => {
  const [proposalId, setProposalId] = useState("");
  const [asEmail, setAsEmail] = useState("");
  const [result, setResult] = useState("");
  const [proposalDetails, setProposalDetails] = useState("");
  const [loading, setLoading] = useState(false);

  let handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const getVotingConsentTokenResponse =
        await getLambdaStakingAndVotingConsentToken(
          proposalId,
          asEmail,
          "Voting and Staking"
        );
      setLoading(false);
      if (getVotingConsentTokenResponse.status !== "USER_CONSENT_NEEDED") {
        alert(
          "Error getting consent token: " +
            JSON.stringify(getVotingConsentTokenResponse)
        );
        return;
      }

      // Get the consent approval from the user
      const consentApproval = await sdk.getConsent(
        getVotingConsentTokenResponse.consentToken
      );

      if (consentApproval.status !== "QUEUED") {
        console.log(
          "Error getting consent approval: " + JSON.stringify(consentApproval)
        );
        alert(
          "Error getting consent approval: " + JSON.stringify(consentApproval)
        );
        return;
      }

      setResult(consentApproval);
    } catch (error) {
      setLoading(false);
      alert(
        "Error Invoking Staking And Voting Method:" +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  let getProposalDetails = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const getProposalResponse = await getProposal(proposalId);
      console.log(getProposalResponse);
      setLoading(false);
      if (getProposalResponse.status === "FUNCTION_FAILURE") {
        alert(
          "Error getting proposal details: " + getProposalResponse.failureReason
        );
        return;
      }
      if (getProposalResponse.status !== "SUCCESS") {
        alert(
          "Error getting proposal details: " +
            JSON.stringify(getProposalResponse)
        );
        return;
      }
      setProposalDetails(getProposalResponse);
    } catch (error) {
      setLoading(false);
      alert(
        "Error getting proposal Details:" +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  if (!proposalDetails) {
    return loading === false ? (
      <div className="voting">
        <h1>Vote for Proposal</h1>
        <form onSubmit={getProposalDetails}>
          <label>
            Proposal Id:
            <input
              type="text"
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
            />
          </label>
          <input type="submit" value="Get Proposal" />
        </form>
      </div>
    ) : (
      <div
        className="spinner-border text-primary"
        id="loader"
        role="status"
      ></div>
    );
  }

  if (!result) {
    return (
      <div className="voting">
        <h1>Vote Proposal</h1>
        <div
          className="Row"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          <div className="Column">
            <div className="Card">
              <div className="CardHeader">
                <h3>Proposal Details</h3>
              </div>
              <div className="CardBody">
                <div className="CardRow">
                  <div
                    className="CardRowLabel"
                    style={{
                      textEmphasis: "bold",
                    }}
                  >
                    Proposal ID:
                  </div>
                  <div className="CardRowValue">
                    {proposalDetails.data["name"]}
                  </div>
                </div>
                <div className="CardRow">
                  <div className="CardRow">
                    <div
                      className="CardRowLabel"
                      style={{
                        textEmphasis: "bold",
                      }}
                    >
                      Proposal Description:
                    </div>
                    <div className="CardRowValue">
                      {proposalDetails.data["description"]}
                    </div>
                  </div>
                  <div className="CardRow"></div>
                  <div
                    className="CardRowLabel"
                    style={{
                      textEmphasis: "bold",
                    }}
                  >
                    Proposal Total Votes:
                  </div>
                  <div className="CardRowValue">
                    {proposalDetails.data["voteCount"]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="Column"
            style={{
              marginLeft: "50px",
            }}
          >
            <form onSubmit={handleSubmit}>
              <label>
                <h4 style={{ align: "center" }}>Voter Email</h4>
                <input
                  style={{ width: "300px" }}
                  type="text"
                  value={asEmail}
                  onChange={(e) => setAsEmail(e.target.value)}
                />
              </label>
              {loading === false ? (
                <input type="submit" value="Vote" />
              ) : (
                <div
                  className="spinner-border text-primary"
                  id="loader"
                  role="status"
                ></div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6">
          <h1>Transaction Details</h1>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Transaction ID</h5>
              <p className="card-text">{result.transactionId}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Status</h5>
              <p className="card-text">{result.status}</p>
            </div>
            <div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Transaction Hash</h5>
                  <p className="card-text">{result.transactionHash}</p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Transaction ChainScan URL</h5>
                  <p className="card-text">
                    <a href={result.transactionChainScanUrl}>
                      {result.transactionChainScanUrl}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          style={{
            margin: "10px",
            display: "inline-block",
            width: "100px",
            height: "50px",
            fontSize: "20px",
            backgroundColor: "white",
            border: "1px solid black",
            borderRadius: "5px",
          }}
          onClick={() => {
            setResult(null);
            setProposalDetails(null);
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};
