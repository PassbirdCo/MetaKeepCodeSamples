pragma solidity ^0.8.0;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../VotingUpgradeable.sol";

contract Proxy is ERC1967Proxy {
    constructor(address lambdaOwner, string memory lambdaName, address _logic, bytes memory _data) 
    ERC1967Proxy(_logic, _data)
    

    {
        // solhint-disable-previous-line no-empty-blocks
    }
}