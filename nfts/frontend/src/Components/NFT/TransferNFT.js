import React, { useState } from "react";
import getNftTransferConsentToken from "../../utils/nftUtils";
import "./TransferNFT.css";

export const TransferNFT = ({ sdk }) => {
  const [tokenId, setTokenId] = useState("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [result, setResult] = useState(null);

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const getConsentTokenResponse = await getNftTransferConsentToken(
        tokenId,
        to,
        from
      );

      if (getConsentTokenResponse.status !== "USER_CONSENT_NEEDED") {
        alert(
          "Error generating consent token: " +
            JSON.stringify(getConsentTokenResponse)
        );
        return;
      }

      const consentToken = getConsentTokenResponse.consentToken;
      const getUserConsentResponse = await sdk.getConsent(consentToken);

      if (getUserConsentResponse.status !== "QUEUED") {
        console.log(getUserConsentResponse);
        alert(
          "Error transferring NFT: " + JSON.stringify(getUserConsentResponse)
        );
      }

      setResult(getUserConsentResponse);
    } catch (error) {
      alert(
        "Error transferring NFT: " +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  return !result ? (
    <div className="transferNFT">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="tokenId"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          required={true}
        />
        <input
          type="text"
          id="from"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="text"
          id="to"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required={true}
        />
        <button id="button" type="submit">
          Transfer NFT
        </button>
      </form>
      <div className="outcome">{result && <pre>{result}</pre>}</div>
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
