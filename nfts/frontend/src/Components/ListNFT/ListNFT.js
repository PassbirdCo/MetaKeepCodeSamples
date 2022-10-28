import React, { useState } from "react";
import getNftTokenList from "../../utils/transferNft";

export const ListNFT = () => {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState(null);

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const getNftTokenListResponse = await getNftTokenList(
                email
            );

            if (getNftTokenListResponse.status !== "SUCCESS") {
                alert(
                    "Error fetching the Nft Token List: " +
                    JSON.stringify(getNftTokenListResponse)
                );
                return;
            }
        
            setResult(getNftTokenListResponse);
        } catch (error) {
            alert(
                "Error fetching the Nft Token List: " +
                (error.message ? error.message : JSON.stringify(error))
            );
        }
    };

    return (
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
    )
}