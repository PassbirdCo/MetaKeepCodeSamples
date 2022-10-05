import React, { useState } from "react";
import getLambdaVotingConsentToken from "../../utils/lambdInvokeUtils";
import "./Voting.css";

export const Voting = ({ sdk }) => {
  const [voterId, setVoterId] = useState("");
  const [asEmail, setAsEmail] = useState("");
  const [result, setResult] = useState("");

  let handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const getVotingConsentTokenResponse = await getLambdaVotingConsentToken(
        voterId,
        asEmail,
        "Voting"
      );

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
      alert(
        "Error Invoking Voting Method:" +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  return !result ? (
    <div className="voting">
      <h1>Vote for Your Favourite Candidate!</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="voterId">Candidate Email Id</label>
          <input
            type="text"
            className="form-control"
            id="voterId"
            placeholder="Enter Voter Email"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="asEmail">Your Email</label>
          <input
            type="text"
            className="form-control"
            id="asEmail"
            placeholder="Enter Your Email"
            value={asEmail}
            onChange={(e) => setAsEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Vote
        </button>
      </form>
    </div>
  ) : (
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
    </div>
  );
};
