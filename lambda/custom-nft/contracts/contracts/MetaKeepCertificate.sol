//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


// This is the main building block for smart contracts.
contract MetaKeepCertificates is ERC721 {

    struct CertificateHolder {
        string name;
        string email;
        uint256 certificateId; // this is the id of the certificate ie token Id
    }

    address public owner;
    uint256 public certificateCount = 0;

    mapping(uint256 => CertificateHolder) public certificateHolders;
    // This is the constructor whose code is
    // run only when the contract is created.
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        owner = msg.sender;
        console.log("Deploying a Token contract");
    }

    function mint(address to, uint256 tokenId, string memory name, string memory email) public {
        require(msg.sender == owner, "Only owner can mint");
        CertificateHolder storage certificateHolder = certificateHolders[tokenId];
        certificateHolder.certificateId = tokenId;
        certificateHolder.name = name;
        certificateHolder.email = email;
        _mint(to, tokenId);
    }

    // A function to destroy certificate if the reciever looses the wallet.
    function destroy(uint256 tokenId) public {
        require(msg.sender == owner, "Only owner can burn");
        delete certificateHolders[tokenId];
        _burn(tokenId);

    }

    function _baseURI() internal pure override virtual returns (string memory) {
        return "https://api.example.com/";
    }

    // A certificate cannot be transferred to any one.
    function _transfer(address from, address to, uint256 tokenId) internal override(ERC721) {
        revert("Cannot transfer");
    }

    function getCertificate(uint256 tokenId) public view returns (CertificateHolder memory) {
        return certificateHolders[tokenId];
    }
}