import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { getNftTokenList } from "../../utils/nftUtils";
import getNftTransferConsentToken from "../../utils/nftUtils";

export const ListNFT = ({ sdk }) => {
  const [email, setEmail] = useState("");
  const [nftList, setNftList] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const getNftTokenListResponse = await getNftTokenList(email);

      if (getNftTokenListResponse.status !== "SUCCESS") {
        alert(
          "Error fetching the Nft Token List: " +
            JSON.stringify(getNftTokenListResponse)
        );
        return;
      }
      if (
        getNftTokenListResponse.status === "SUCCESS" &&
        getNftTokenListResponse.totalCount === "0"
      ) {
        alert("No NFTs found for this email");
      }
      setNftList(getNftTokenListResponse);
    } catch (error) {
      alert(
        "Error fetching the Nft Token List: " +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  let handleTransfer = async (tokenId, to) => {
    try {
      const getConsentTokenResponse = await getNftTransferConsentToken(
        tokenId,
        to,
        email
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
      setTransactionStatus(getUserConsentResponse);
    } catch (error) {
      alert(
        "Error transferring NFT: " +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  if (!nftList) {
    return (
      <div className="listNFT">
        <h2
          style={{
            textAlign: "center",
          }}
        >
          Login by Entering your Email
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            style={{
              width: "300px",
              height: "30px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              padding: "0 10px",
              margin: "10px 0",
            }}
          />
          <button
            type="submit"
            style={{
              width: "200px",
              height: "30px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              padding: "0 10px",
              margin: "10px 0",
              backgroundColor: "black",
              color: "white",
              cursor: "pointer",
            }}
          >
            List NFT
          </button>
        </form>
      </div>
    );
  }

  if (!transactionStatus) {
    return (
      <div>
        <div className="listNFT">
          <h1
            style={{
              textAlign: "center",
              color: "black",
              fontSize: "30px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Nfts You Own
          </h1>
          {nftList.tokens.map((nftToken) => (
            <Card
              style={{
                width: "18rem",
                margin: "10px",
                display: "inline-block",
              }}
            >
              <Card.Body>
                <Card.Title>{nftToken.token}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {nftToken.tokenMetadata
                    ? nftToken.tokenMetadata.name
                    : "Undefined"}
                </Card.Subtitle>
                <Card.Img
                  variant="top"
                  src={
                    nftToken.tokenMetadata
                      ? nftToken.tokenMetadata.image
                      : "Undefined"
                  }
                  style={{ width: "250px", height: "200px" }}
                />
                <Card.Text>
                  {nftToken.tokenMetadata
                    ? nftToken.tokenMetadata.description
                    : "No Description Found"}
                </Card.Text>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTransfer(
                      nftToken.token,
                      e.target.elements["to"].value
                    );
                  }}
                >
                  <input type="text" id="to" placeholder="To" required={true} />
                  <button
                    style={{
                      margin: "10px",
                      display: "inline-block",
                      width: "100px",
                      height: "30px",
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "5px",
                    }}
                    type="submit"
                  >
                    Transfer
                  </button>
                </form>
                <Card.Link href="#">
                  {nftToken.tokenMetadata
                    ? nftToken.tokenMetadata.external_url
                    : "https://metakeep.xyz"}
                </Card.Link>
              </Card.Body>
            </Card>
          ))}
        </div>
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
          onClick={() => setNftList(null)}
        >
          Back
        </button>
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
              <p className="card-text">{transactionStatus.transactionId}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Status</h5>
              <p className="card-text">{transactionStatus.status}</p>
            </div>
            <div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Transaction Hash</h5>
                  <p className="card-text">
                    {transactionStatus.transactionHash}
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Transaction ChainScan URL</h5>
                  <p className="card-text">
                    <a href={transactionStatus.transactionChainScanUrl}>
                      {transactionStatus.transactionChainScanUrl}
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
          onClick={() => setTransactionStatus(null)}
        >
          Back
        </button>
      </div>
    </div>
  );
};
