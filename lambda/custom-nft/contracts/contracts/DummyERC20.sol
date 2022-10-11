// this contract is only for testing purpose. You can deploy erc20 contract directly from the Metakeep createCurrency API.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyERC20 is ERC20 {

    address public owner;
    
    constructor() ERC20("DummyCoin", "DC") {
        owner = _msgSender();
        console.log("Deploying a Dummy ERC20 contract");
    }

    function mint(address to, uint256 amount) public {
        require(_msgSender() == owner, "only owner can mint");
        _mint(to, amount);
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
}
