// THIS FILE IS ADDED FOR TESTING PURPOSES ONLY
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambdaUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

// This contract is an upgraded version of CustomERC721Upgradeable.sol.
// It's used to test the upgradeability of the contract. The logic of the burn
// function has been changed to prevent burning of token with ID 0.
contract CustomERC721UpgradeableV2 is
    ERC721URIStorageUpgradeable,
    MetaKeepLambdaUpgradeable,
    UUPSUpgradeable
{
    mapping(address => bool) public isWhitelisted;
    mapping(address => bool) public ownsToken;

    // override the  _msgSender() method to support MetaKeep Lambda transactions.
    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    // MetaKeep Lambda takes two constructor arguments, lambdaOwner and lambdaName.
    // We can use Collection Name as the lambdaName.
    //
    // Initializing the contract in constructor is not required for upgradeable contracts.
    // But it's a good safety practise to prevent any potentially harmful operation from happening
    // (e.g. a self destruct function if there's any).
    constructor(
        string memory lambdaName,
        string memory symbol,
        address lambdaOwner
    ) {
        initialize(lambdaName, symbol, lambdaOwner);
    }

    function initialize(
        string memory lambdaName,
        string memory symbol,
        address lambdaOwner
    ) public initializer {
        __ERC721_init(lambdaName, symbol);
        _MetaKeepLambda_init(lambdaOwner, lambdaName);
    }

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

    function burn(uint256 tokenId) public onlyMetaKeepLambdaOwner {
        // Added this check to ensure that tokenId is greater than 0
        require(tokenId > 0, "Token ID must be greater than 0");
        super._burn(tokenId);
    }

    function addToWhitelist(address to) public onlyMetaKeepLambdaOwner {
        isWhitelisted[to] = true;
    }

    function removeFromWhitelist(address to) public onlyMetaKeepLambdaOwner {
        isWhitelisted[to] = false;
    }

    /**
    @dev this function needs to be overriden to ensure the contract can be upgraded
    by the MetaKeep Lambda owner.
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyMetaKeepLambdaOwner
    {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
