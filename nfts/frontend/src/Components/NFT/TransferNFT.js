import React, {useState} from "react";
import TransferNFTService from "../../utils/transferNft";
import "./TransferNFT.css";


export const TransferNFT = ({sdk}) => {

    const [collection, setCollection] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [to, setTo] = useState("");
    const [from, setFrom] = useState("");
    const [result, setResult] = useState(null);
    const [errors, setErrors] = useState(null);

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await TransferNFTService(collection, tokenId, to, from);
            if(result.status == "USER_CONSENT_NEEDED"){
                const consentToken = result.consentToken;
                const consent = await sdk.getConsent(consentToken);
                if(consent.status == "QUEUED"){
                    setResult(consent)
                    console.log(result)
                }
                else{
                    setErrors(consent.status);
                }
            }
                } catch (error) {
                    console.log(error);
                }
            };

    return ( !result ?
        <div className="transferNFT">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id = "collection"
                    placeholder="Collection"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    required={true}
                />
                <input
                    type="text"
                    id = "tokenId"
                    placeholder="Token ID"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    required={true}
                />
                <input
                    type="text"
                    id = "to"
                    placeholder="To"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required={true}
                />
                <input
                    type="text"
                    id = "from"
                    placeholder="From"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                />
                <button id="button" type="submit">Transfer NFT</button>
            </form>
            <div className="outcome">
                {result && <pre>{result}</pre>}
                {errors && <pre>{errors}</pre>}
            </div>
        </div> : <div className="container">
                <div class="row">
                    <div class="col-sm-6">
                    <h1>Transaction Details</h1>
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Transaction ID</h5>
                                <p class="card-text">{result.transactionId}</p>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Status</h5>
                                <p class="card-text">{result.status}</p>
                            </div>
                            <div>
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Transaction Hash</h5>
                                        <p class="card-text">{result.transactionHash}</p>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Transaction ChainScan URL</h5>
                                        <p class="card-text"><a href={result.transactionChainScanUrl}>{result.transactionChainScanUrl}</a></p>
                                    </div>
                                </div>
                            </div>

                    </div>
                    </div>
                </div>
                        
                        
            </div>
    );
}