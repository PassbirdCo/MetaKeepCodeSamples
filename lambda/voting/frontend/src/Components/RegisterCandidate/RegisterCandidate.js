import React, { useState } from "react";
import { registerCandidature } from "../../utils/lambdaInvokeUtils";
import "./RegisterCandidate.css";

export const RegisterCandidate = () => {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  let handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const registerCandidatureResponse = await registerCandidature(
        candidateEmail
      );

      setLoading(false);
      if (registerCandidatureResponse.status !== "QUEUED") {
        console.log(
          "Error registering Candidate: " +
            JSON.stringify(registerCandidatureResponse)
        );
        alert(
          "Error registering Candidate: " +
            JSON.stringify(registerCandidatureResponse)
        );
        return;
      }

      setResult(registerCandidatureResponse);
    } catch (error) {
      setLoading(false);
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

        {loading === true ? (
          <div
            className="spinner-border text-primary"
            id="loader"
            role="status"
          ></div>
        ) : (
          <button type="submit" className="btn btn-primary" id="voteButton">
            Register
          </button>
        )}
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
