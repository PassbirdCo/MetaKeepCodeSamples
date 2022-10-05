import React, { useState } from "react";
import getLambdaVotingConsentToken, {
  registerCandidature,
} from "../../utils/lambdInvokeUtils";
import "./RegisterCandidate.css";

export const RegisterCandidate = () => {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [result, setResult] = useState("");

  let handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const getRegistrationResponse = await registerCandidature(candidateEmail);

      if (getRegistrationResponse.status !== "QUEUED") {
        console.log(
          "Error registering Candidate: " +
            JSON.stringify(getRegistrationResponse)
        );
        alert(
          "Error registering Candidate: " +
            JSON.stringify(getRegistrationResponse)
        );
        return;
      }

      setResult(getRegistrationResponse);
    } catch (error) {
      alert(
        "Error Invoking Registration Method:" +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  return !result ? (
    <div className="registerCandidate">
      <h1>Register the Candidate!</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="voterId">Candidate Email</label>
          <input
            type="text"
            className="form-control"
            id="voterId"
            placeholder="Enter Candidate Email"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
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
