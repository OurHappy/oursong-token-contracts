// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract OurCoin is Context, ERC20, ERC20Burnable {
    
  string private _name;
  string private _symbol;
    
  constructor(string memory name_, string memory symbol_, uint256 initialSupply_) public {
    _name = name_;
    _symbol = symbol_;
    _mint(_msgSender(), initialSupply_);
  }
}
