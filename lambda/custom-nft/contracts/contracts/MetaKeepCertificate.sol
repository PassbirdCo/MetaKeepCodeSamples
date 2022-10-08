//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";


// This is the main building block for smart contracts.
contract MetaKeepCertificates is ERC721, MetaKeepLambda {

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
    constructor(string memory symbol, address lambdaOwner, string memory lambdaName) ERC721(lambdaName, symbol) MetaKeepLambda(lambdaOwner, lambdaName) {
        owner = _msgSender();
        console.log("Deploying a MetaKeep Certificate contract");
    }

    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    function mint(address to, uint256 tokenId, string memory name, string memory email) onlyMetaKeepLambdaOwner() public {
        CertificateHolder storage certificateHolder = certificateHolders[tokenId];
        certificateHolder.certificateId = tokenId;
        certificateHolder.name = name;
        certificateHolder.email = email;
        _mint(to, tokenId);
    }

    // A function to destroy certificate if the reciever looses the wallet.
    function destroy(uint256 tokenId) onlyMetaKeepLambdaOwner() public {
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