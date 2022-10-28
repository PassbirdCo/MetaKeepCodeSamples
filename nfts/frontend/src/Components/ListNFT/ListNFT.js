import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { json } from "react-router-dom";
import { getNftTokenList } from "../../utils/nftUtils";
import getNftTransferConsentToken from "../../utils/nftUtils";

export const ListNFT = ({ sdk }) => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);

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
        getNftTokenListResponse.tokens.length == 0
      ) {
        alert("No NFTs found for this email");
      }
      setResult(getNftTokenListResponse);
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
    } catch (error) {
      alert(
        "Error transferring NFT: " +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  return !result ? (
    <div className="listNFT">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />
        <button type="submit">List NFT</button>
      </form>
    </div>
  ) : (
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
        {result.tokens.map((nftToken) => (
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
                {nftToken.metadata ? nftToken.metadata.name : "Undefined"}
              </Card.Subtitle>
              <Card.Img
                variant="top"
                src={nftToken.metadata ? nftToken.metadata.image : "Undefined"}
              />
              <Card.Text>
                {nftToken.metadata
                  ? nftToken.metadata.description
                  : "No Description Found"}
              </Card.Text>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTransfer(nftToken.token, e.target.elements["to"].value);
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
                {nftToken.metadata
                  ? nftToken.metadata.external_url
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
        onClick={() => setResult(null)}
      >
        Back
      </button>
    </div>
  );
};
