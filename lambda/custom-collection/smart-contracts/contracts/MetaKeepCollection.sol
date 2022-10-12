pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MetaKeepCollection is ERC721 {

  address public owner;
  mapping (address=>bool) public isWhitelisted;
  mapping (address=>bool) public ownsToken;

  modifier onlyOwner() {
    require(_msgSender() == owner, "Only owner can call this function.");
    _;
  }

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    owner = _msgSender();
  }

  function mint(address to, uint256 tokenId) onlyOwner public {
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

  function burn (uint256 tokenId) onlyOwner public {
    _burn(tokenId);
  }

  function addToWhitelist(address to) onlyOwner public {
    isWhitelisted[to] = true;
  }

  function removeFromWhitelist(address to) onlyOwner public {
    isWhitelisted[to] = false;
  }

}