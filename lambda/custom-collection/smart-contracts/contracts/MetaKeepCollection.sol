pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";

contract MetaKeepCollection is ERC721, MetaKeepLambda {

  mapping (address=>bool) public isWhitelisted;
  mapping (address=>bool) public ownsToken;

  function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
  }

  constructor(
    string memory lambdaName, 
    string memory symbol, 
    address lambdaOwner
    ) ERC721(lambdaName, symbol) MetaKeepLambda(lambdaOwner, lambdaName) {}

  function mint(address to, uint256 tokenId) onlyMetaKeepLambdaOwner public {
    require(isWhitelisted[to], "Address is not whitelisted.");
    require(!ownsToken[to], "Address already owns a token.");
    ownsToken[to] = true;
    _mint(to, tokenId);
  }

  function _baseURI() internal pure override returns (string memory) {
    return "https://api.metakeep.xyz/metadata/";
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    return string(abi.encodePacked(_baseURI(), tokenId));
  }

  function burn (uint256 tokenId) onlyMetaKeepLambdaOwner public {
    _burn(tokenId);
  }

  function addToWhitelist(address to) onlyMetaKeepLambdaOwner public {
    isWhitelisted[to] = true;
  }

  function removeFromWhitelist(address to) onlyMetaKeepLambdaOwner public {
    isWhitelisted[to] = false;
  }

}