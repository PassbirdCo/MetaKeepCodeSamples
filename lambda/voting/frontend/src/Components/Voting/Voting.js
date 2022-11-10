import React, { useState } from "react";
import getLambdaVotingConsentToken, {
  getCandidature,
} from "../../utils/lambdaInvokeUtils";
import "./Voting.css";

export const Voting = ({ sdk }) => {
  const [voterId, setVoterId] = useState("");
  const [asEmail, setAsEmail] = useState("");
  const [result, setResult] = useState("");
  const [candidateDetails, setCandidateDetails] = useState("");
  const [loading, setLoading] = useState(false);

  let handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const getVotingConsentTokenResponse = await getLambdaVotingConsentToken(
        voterId,
        asEmail,
        "Voting"
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
        "Error Invoking Voting Method:" +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  let getCandidateDetails = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const getCandidateDetailsResponse = await getCandidature(voterId);
      setLoading(false);
      if (getCandidateDetailsResponse.status === "FUNCTION_FAILURE") {
        alert(
          "Error getting candidate details: " +
            getCandidateDetailsResponse.failure_reason
        );
        return;
      }
      if (getCandidateDetailsResponse.status !== "SUCCESS") {
        alert(
          "Error getting candidate details: " +
            JSON.stringify(getCandidateDetailsResponse)
        );
        return;
      }
      setCandidateDetails(getCandidateDetailsResponse);
    } catch (error) {
      setLoading(false);
      alert(
        "Error getting Candidate Details:" +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  if (!candidateDetails) {
    return loading === false ? (
      <div className="voting">
        <h1>Vote Candidature</h1>
        <form onSubmit={getCandidateDetails}>
          <label>
            Candidate Email:
            <input
              type="text"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
            />
          </label>
          <input type="submit" value="Get Candidate" />
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
    return loading === false ? (
      <div className="voting">
        <h1>Vote Candidature</h1>
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
                <h3>Candidate Details</h3>
              </div>
              <div className="CardBody">
                <div className="CardRow">
                  <div
                    className="CardRowLabel"
                    style={{
                      textEmphasis: "bold",
                    }}
                  >
                    Candidate Wallet Address:
                  </div>
                  <div className="CardRowValue">{candidateDetails.data[0]}</div>
                </div>
                <div className="CardRow">
                  <div
                    className="CardRowLabel"
                    style={{
                      textEmphasis: "bold",
                    }}
                  >
                    Candidate Total Votes:
                  </div>
                  <div className="CardRowValue">{candidateDetails.data[1]}</div>
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
              <input type="submit" value="Vote" />
            </form>
          </div>
        </div>
      </div>
    ) : (
      <div
        className="spinner-border text-primary"
        id="loader"
        role="status"
      ></div>
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
            setCandidateDetails(null);
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};
