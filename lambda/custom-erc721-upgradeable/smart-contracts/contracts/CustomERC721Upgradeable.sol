pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract CustomERC721Upgradeable is
    ERC721URIStorageUpgradeable,
    UUPSUpgradeable
{
    address public owner;
    mapping(address => bool) public isWhitelisted;
    mapping(address => bool) public ownsToken;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    // Initializing the contract in constructor is not required for upgradeable contracts.
    // But it's a good safety practise to prevent any potentially harmful operation from happening
    // (e.g. a self destruct function if there's any)
    constructor(string memory name, string memory symbol) {
        owner = _msgSender();
        initialize(name, symbol);
    }

    function initialize(string memory name, string memory symbol)
        public
        initializer
    {
        __ERC721_init(name, symbol);
    }

    function mint(address to, uint256 tokenId) public onlyOwner {
        require(isWhitelisted[to], "Address is not whitelisted.");
        require(!ownsToken[to], "Address already owns a token.");
        ownsToken[to] = true;
        _mint(to, tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        // Update this with a valid URL
        return "";
    }

    function burn(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
    }

    function addToWhitelist(address to) public onlyOwner {
        isWhitelisted[to] = true;
    }

    function removeFromWhitelist(address to) public onlyOwner {
        isWhitelisted[to] = false;
    }

    /**
    @dev this function needs to be overriden to ensure the contract can be upgraded
    by the owner.
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
