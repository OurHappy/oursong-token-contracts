// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";

contract SongFToken is Context, AccessControl, ERC20Burnable, ERC20Pausable {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor(string memory name_, string memory symbol_, uint256 initialSupply_, uint8 decimals_) public ERC20(name_, symbol_) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());

    _setupDecimals(decimals_);
    _mint(_msgSender(), initialSupply_);
  }

  /**
    * @dev Creates `amount` new tokens for `to`.
    *
    * See {ERC20-_mint}.
    *
    * Requirements:
    *
    * - the caller must have the `MINTER_ROLE`.
    */
  function mint(address to, uint256 amount) public virtual {
    require(hasRole(MINTER_ROLE, _msgSender()), "SongFToken: must have minter role to mint");
    _mint(to, amount);
  }

  /**
    * @dev Pauses all token transfers.
    *
    * See {ERC20Pausable} and {Pausable-_pause}.
    *
    * Requirements:
    *
    * - the caller must have the `PAUSER_ROLE`.
    */
  function pause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "SongFToken: must have pauser role to pause");
    _pause();
  }

  /**
    * @dev Unpauses all token transfers.
    *
    * See {ERC20Pausable} and {Pausable-_unpause}.
    *
    * Requirements:
    *
    * - the caller must have the `PAUSER_ROLE`.
    */
  function unpause() public virtual {
    require(hasRole(PAUSER_ROLE, _msgSender()), "SongFToken: must have pauser role to unpause");
    _unpause();
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20Pausable) {
    super._beforeTokenTransfer(from, to, amount);
  }
}
