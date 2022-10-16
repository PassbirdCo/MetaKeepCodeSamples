pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";

contract CustomERC1155 is ERC1155 {
    address public owner;

    modifier onlyOwner() {
        require(
            owner == _msgSender(),
            "Only Owner can access the specific method"
        );
        _;
    }

    constructor(string memory uri_) ERC1155(uri_) {
        owner = _msgSender();
        console.log("Deployed ERC1155");
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(to, id, amount, data);
    }

    function burn(
        address from,
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        _burn(from, id, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        _safeTransferFrom(from, to, id, amount, data);
    }
}
