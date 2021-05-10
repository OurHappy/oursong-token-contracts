// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./GSN/Context.sol";
import "./ERC1155/ERC1155.sol";
import "./ERC1155/ERC1155Burnable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract OurSongFToken is Context, Ownable, ERC1155, ERC1155Burnable {
  using SafeMath for uint256;

  string private _name;
  string private _symbol;
  string private _contractURI;
  mapping (uint256 => uint256) private _tokenSupply;

  constructor(string memory uri_) public {
    _name = 'OURSONG NFT 1155';
    _symbol = 'OURNFT1155';
    _setURI(uri_);
    setContractURI(uri_);
  }

  /**
    * @dev Returns the name of the token.
    */
  function name() public view returns (string memory) {
    return _name;
  }

  /**
    * @dev Returns the symbol of the token, usually a shorter version of the
    * name.
    */
  function symbol() public view returns (string memory) {
    return _symbol;
  }

  function setURI(string memory uri_) public onlyOwner {
    _setURI(uri_);
  }

  function contractURI() public view returns (string memory) {
    return _contractURI;
  }

  function setContractURI(string memory contractURI_) public onlyOwner {
    _contractURI = contractURI_;
  }

  /**
   * @dev Returns the total quantity for a token ID
   * @param id uint256 ID of the token to query
   * @return amount of token in existence
   */
  function totalSupply(
    uint256 id
  ) public view returns (uint256) {
    return _tokenSupply[id];
  }

  /**
    * @dev Creates `amount` new tokens for `to`, of token type `id`.
    *
    * See {ERC1155-_mint}.
    *
    * Requirements:
    *
    * - the caller must have the `MINTER_ROLE`.
    */
  function mint(address to, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
    _mint(to, id, amount, data);
    _tokenSupply[id] = _tokenSupply[id].add(amount);
  }
}
