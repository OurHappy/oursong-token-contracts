// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Pausable.sol";

contract OurSongNFToken is Context, Ownable, ERC721Burnable, ERC721Pausable {
  string private _contractURI;

  constructor(string memory name_, string memory symbol_, string memory baseURI_) public ERC721(name_, symbol_) {
    _setBaseURI(baseURI_);
    setContractURI(baseURI_);
  }

  function setBaseURI(string memory baseURI_) public virtual onlyOwner {
    _setBaseURI(baseURI_);
  }

  function contractURI() public view virtual returns (string memory) {
    return _contractURI;
  }

  function setContractURI(string memory contractURI_) public virtual onlyOwner {
    _contractURI = contractURI_;
  }

  /**
    * @dev Creates a new token for `to`. Its token ID will be automatically
    * assigned (and available on the emitted {IERC721-Transfer} event), and the token
    * URI autogenerated based on the base URI passed at construction.
    *
    * See {ERC721-_mint}.
    *
    * Requirements:
    *
    * - the caller must have the `MINTER_ROLE`.
    */
  function mint(address to_, uint256 tokenId_) public virtual onlyOwner {
    _mint(to_, tokenId_);
  }

  /**
    * @dev Pauses all token transfers.
    *
    * See {ERC721Pausable} and {Pausable-_pause}.
    *
    * Requirements:
    *
    * - the caller must have the `PAUSER_ROLE`.
    */
  function pause() public virtual onlyOwner {
    _pause();
  }

  /**
    * @dev Unpauses all token transfers.
    *
    * See {ERC721Pausable} and {Pausable-_unpause}.
    *
    * Requirements:
    *
    * - the caller must have the `PAUSER_ROLE`.
    */
  function unpause() public virtual onlyOwner {
    _unpause();
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
