// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract OurCoin is Context, ERC20Detailed, ERC20Burnable {

  constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 initialSupply_) ERC20Detailed(name_, symbol_, decimals_) public {
    _mint(_msgSender(), initialSupply_);
  }
}
