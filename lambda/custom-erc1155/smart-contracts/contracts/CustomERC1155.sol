pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "metakeep-lambda/ethereum/contracts/MetaKeepLambda.sol";
import "hardhat/console.sol";

contract CustomERC1155 is ERC1155, MetaKeepLambda {
    // override the  _msgSender() method to support MetaKeep Lambda transactions.
    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    //MetaKeep Lambda takes two constructor arguments, lambdaOwner and lambdaName.
    constructor(
        string memory uri_,
        address lambdaOwner,
        string memory lambdaName
    ) ERC1155(uri_) MetaKeepLambda(lambdaOwner, lambdaName) {
        console.log("Deployed ERC1155");
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyMetaKeepLambdaOwner {
        _mint(to, id, amount, data);
    }

    function burn(
        address from,
        uint256 id,
        uint256 amount
    ) public onlyMetaKeepLambdaOwner {
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
