import React, { useState } from "react";
import getLambdaMemoInvokeConsentToken from "../../utils/lambdaInvokeUtils";
import "./LogMemo.css";

export const LogMemo = ({ sdk }) => {
  const [logMessage, setLogMessage] = useState("");
  const [asEmail, setAsEmail] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  let handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const getLambdaMemoInvokeConsentTokenResponse =
        await getLambdaMemoInvokeConsentToken(asEmail, logMessage);
      setLoading(false);
      if (
        getLambdaMemoInvokeConsentTokenResponse.status !== "USER_CONSENT_NEEDED"
      ) {
        alert(
          "Error getting consent token: " +
            JSON.stringify(getLambdaMemoInvokeConsentTokenResponse)
        );
        return;
      }

      // Get the consent approval from the user
      const consentApproval = await sdk.getConsent(
        getLambdaMemoInvokeConsentTokenResponse.consentToken
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
        "Error Invoking LogMemo Method:" +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  if (!result) {
    return (
      <form
        onSubmit={handleSubmit}
        style={{ textAlign: "center", margin: "20px" }}
      >
        <label style={{ display: "block", marginBottom: "10px" }}>
          <h4>Log Memo</h4>
          <input
            style={{ width: "300px", marginBottom: "10px", padding: "5px" }}
            type="text"
            value={asEmail}
            onChange={(e) => setAsEmail(e.target.value)}
            placeholder="Enter email"
          />
          <br />
          <input
            style={{ width: "300px", marginBottom: "10px", padding: "5px" }}
            type="text"
            value={logMessage}
            onChange={(e) => setLogMessage(e.target.value)}
            placeholder="Enter log message"
          />
        </label>
        {loading === false ? (
          <input
            type="submit"
            value="Invoke Log Memo"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
        ) : (
          <div
            className="spinner-border text-primary"
            id="loader"
            role="status"
            style={{ margin: "20px" }}
          ></div>
        )}
      </form>
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
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};
