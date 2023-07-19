import React, { useState } from "react";
import { addProposal } from "../../utils/lambdaInvokeUtils";
import "./AddProposal.css";

export const AddProposal = () => {
  const [proposalName, setProposalName] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  let handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const addProposalResponse = await addProposal(
        proposalName,
        proposalDescription
      );

      setLoading(false);
      if (addProposalResponse.status !== "QUEUED") {
        console.log(
          "Error adding proposal: " +
            JSON.stringify(addProposalResponse)
        );
        alert(
          "Error adding proposal: " +
            JSON.stringify(addProposalResponse)
        );
        return;
      }

      setResult(addProposalResponse);
    } catch (error) {
      setLoading(false);
      alert(
        "Error Invoking Registration Method:" +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  return !result ? (
    <div className="addProposal">
      <h1>Add the Proposal!</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="proposalName">Proposal Name</label>
          <input
            type="text"
            className="form-control"
            id="proposalName"
            placeholder="Enter the Proposal Name"
            value={proposalName}
            onChange={(e) => setProposalName(e.target.value)}
          />
          <label htmlFor="proposalDescription">Proposal Description</label>
          <input
            type="text"
            className="form-control"
            id="proposalDescription"
            placeholder="Enter the Proposal Description"
            value={proposalDescription}
            onChange={(e) => setProposalDescription(e.target.value)}
          />
        </div>

        {loading === true ? (
          <div
            className="spinner-border text-primary"
            id="loader"
            role="status"
          ></div>
        ) : (
          <button type="submit" className="btn btn-primary" id="addProposalButton">
            Add Proposal
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
