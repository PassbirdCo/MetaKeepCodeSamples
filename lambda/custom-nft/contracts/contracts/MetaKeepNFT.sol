//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";


// This is the main building block for smart contracts.
contract MetaKeepNFT is ERC721, MetaKeepLambda {

    struct NFTSaleInfo {
        address seller;
        uint256 sale_time;
        uint256 cost; // this is the id of the certificate ie token Id
    }

    IERC20 public token;

    mapping(uint256 => NFTSaleInfo) public nftsForSale;
    // This is the constructor whose code is
    // run only when the contract is created.
    constructor(string memory symbol, address lambdaOwner, string memory lambdaName, address erc20Token) ERC721(lambdaName, symbol) MetaKeepLambda(lambdaOwner, lambdaName) {
        token = IERC20(erc20Token);
    }

    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    function mint(address to, uint256 tokenId) onlyMetaKeepLambdaOwner() public {
        _mint(to, tokenId);
    }

    // A function to destroy certificate if the reciever looses the wallet.
    function destroy(uint256 tokenId) onlyMetaKeepLambdaOwner() public {
        require(nftsForSale[tokenId].seller == address(0), "NFT is for sale");
        delete nftsForSale[tokenId];
        _burn(tokenId);

    }

    function _baseURI() internal pure override virtual returns (string memory) {
        return "https://api.example.com/";
    }

    function addForSale(uint256 tokenId, uint256 tokenAmount) external onlyMetaKeepLambdaOwner() {
        require(_exists(tokenId), "nonexistent token");
        require(nftsForSale[tokenId].seller == address(0), "NFT is for sale already");
        require(tokenAmount >= 1000000000, "token amount must be greater than 1 Gwei");
        nftsForSale[tokenId] = NFTSaleInfo({
            seller: ownerOf(tokenId),
            sale_time: block.timestamp + 1 days,
            cost: tokenAmount
        });
    }

    function buy(uint256 tokenId) external {
        // check if the token is for sale
        require(nftsForSale[tokenId].seller != address(0), "ERC721: token is not for sale");
        // check if the sale time is over
        require(nftsForSale[tokenId].sale_time > block.timestamp, "ERC721: token sale has expired");
        // check if the buyer has enough token
        require(token.balanceOf(_msgSender()) >= nftsForSale[tokenId].cost, "ERC20: token cost is greater than your balance");
        
        // calculate the token amount to be transferred to the seller
        uint256 cost = nftsForSale[tokenId].cost;
        // calculate the token amount to be transferred to the smart-contract
        uint256 commission = (cost * 20) / 100;

        // transfer the amount excluding commission to the seller
        token.transferFrom(_msgSender(), nftsForSale[tokenId].seller, cost - commission);
        // transfer the commission to the smart-contract
        token.transferFrom(_msgSender(), address(this), commission);    

        // transfer the NFT to the buyer
        _transfer(nftsForSale[tokenId].seller, _msgSender(), tokenId);

        // delete the NFT from the sale list
        delete nftsForSale[tokenId];
    }

    function getNFTSaleInfo(uint256 tokenId) public view returns (NFTSaleInfo memory) {
        return nftsForSale[tokenId];
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC721)
        returns (bool)
    {
        /**
         * https://solidity-by-example.org/inheritance/
         * When a function is called that is defined multiple times in
         * different contracts, parent contracts are searched from
         * right to left, and in depth-first manner.
         */

        return super.supportsInterface(interfaceId);
    }
}