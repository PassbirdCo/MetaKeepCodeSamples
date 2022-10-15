pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";

contract MetaKeepCollection is ERC721, MetaKeepLambda {
    mapping(address => bool) public isWhitelisted;
    mapping(address => bool) public ownsToken;

    // override the  _msgSender() method to support MetaKeep Lambda transactions.
    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    //MetaKeep Lambda takes two constructor arguments, lambdaOwner and lambdaName. We can use Collection Name as lambdaName.
    constructor(
        string memory lambdaName,
        string memory symbol,
        address lambdaOwner
    ) ERC721(lambdaName, symbol) MetaKeepLambda(lambdaOwner, lambdaName) {}

    function mint(address to, uint256 tokenId) public onlyMetaKeepLambdaOwner {
        require(isWhitelisted[to], "Address is not whitelisted.");
        require(!ownsToken[to], "Address already owns a token.");
        ownsToken[to] = true;
        _mint(to, tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        // Update this with a valid URL
        return "";
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return string(abi.encodePacked(_baseURI(), tokenId));
    }

    function burn(uint256 tokenId) public onlyMetaKeepLambdaOwner {
        _burn(tokenId);
    }

    function addToWhitelist(address to) public onlyMetaKeepLambdaOwner {
        isWhitelisted[to] = true;
    }

    function removeFromWhitelist(address to) public onlyMetaKeepLambdaOwner {
        isWhitelisted[to] = false;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
