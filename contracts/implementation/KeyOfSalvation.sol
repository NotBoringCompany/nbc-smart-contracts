// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

// import '../nft-base/NFTExtendedA.sol';

import '../nft-base/ERC721AExtended.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';
import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import 'operator-filter-registry/src/OperatorFilterer.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';


/**
 * @dev Key of Salvation (aka Genesis Pass) contract.
 */
contract KeyOfSalvation is ERC721AExtended, AccessControl, ERC2981, Ownable, OperatorFilterer {
    using Address for address;
    using Strings for uint256;
    using ECDSA for bytes32;

    /**
     * @dev errors
     */
    // called when max supply is reached and minting is attempted
    error MaxSupplyReached();
    // called when dev mint limit is reached and minting is attempted (from the dev)
    error DevMintLimitReached();
    // called when royalty specified is zero
    error RoyaltyIsZero();
    // called when address specified is the zero address
    error IsZeroAddress();
    // called when address specified is not whitelisted
    error NotWhitelisted();
    // called when address specified has already minted
    error AlreadyMinted();
    // two merkle types: guaranteed and overallocated root
    error InvalidMerkleType();
    // called when guaranteed mint is not allowed
    error NotGuaranteedMint();
    // called when overallocated mint is not allowed
    error NotOverallocatedMint();

    /**
     * @dev Key variables for the Key.
     */
    // max supply of the key
    uint16 public constant MAX_SUPPLY = 5000;
    // max supply a dev can mint
    uint16 public constant DEV_MINT_LIMIT = 500;
    // check is an address has already claimed the whitelist (guaranteed or whitelisted)
    mapping (address => bool) public whitelistClaimed;
    // if guaranteed mint is on
    bool public isGuaranteedMint;
    // if overallocated mint is on
    bool public isOverAllocatedMint;

    constructor() ERC721A('Key Of Salvation', 'KOS') OperatorFilterer(0x0000000000000000000000000000000000000000, false) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // mints a key to a guaranteed WL holder.
    function guaranteedMint(bytes32[] calldata _proof) external {
        if (!isGuaranteedMint) {
            revert NotGuaranteedMint();
        }

        // checks if the address is whitelisted for guaranteed
        if (!_isWhitelisted(1, _msgSender(), _proof)) {
            revert NotWhitelisted();
        }

        // checks if address has already minted
        if (whitelistClaimed[_msgSender()]) {
            revert AlreadyMinted();
        }

        whitelistClaimed[_msgSender()] = true;
        _safeMint(false, _msgSender(), 1);
    }

    // mints a key to an overallocated WL holder.
    function overallocatedMint(bytes32[] calldata _proof) external {
        if (!isOverAllocatedMint) {
            revert NotOverallocatedMint();
        }

        // checks if the address is whitelisted for OA
        if (!_isWhitelisted(2, _msgSender(), _proof)) {
            revert NotWhitelisted();
        }

        // checks if address has already minted
        if (whitelistClaimed[_msgSender()]) {
            revert AlreadyMinted();
        }

        whitelistClaimed[_msgSender()] = true;
        _safeMint(false, _msgSender(), 1);
    }

    // mints _amount of keys to the dev (i.e. DEFAULT_ADMIN_ROLE).
    function devMint(uint16 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _safeMint(true, _msgSender(), _amount);
    }

    function _safeMint(bool _isDevMint, address _to, uint256 _amount) internal virtual {
        // checks if current supply + _amount is greater than max supply
        if (totalSupply() + _amount > MAX_SUPPLY) {
            revert MaxSupplyReached();
        }

        if (_isDevMint) {
            // checks if dev mint limit is reached
            if (balanceOf(_msgSender()) + _amount > DEV_MINT_LIMIT) {
                revert DevMintLimitReached();
            }
        }

        ERC721A._safeMint(_to, _amount);
    }

    /// root hashes of the merkle tree. used for whitelisting
    // merkle root for guaranteed whitelist
    bytes32 public guaranteedMerkleRoot;
    // merkle root for overallocated whitelist
    bytes32 public overallocatedMerkleRoot;

    // sets the root of the tree
    function setMerkleRoot(uint8 _type, bytes32 _merkleRoot) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_type == 1) {
            guaranteedMerkleRoot = _merkleRoot;
        } else if (_type == 2) {
            overallocatedMerkleRoot = _merkleRoot;
        } else {
            revert InvalidMerkleType();
        }
    }

    // checks if an address is whitelisted for either guaranteed or overallocated
    function _isWhitelisted(uint8 _type, address _addr, bytes32[] calldata _proof) internal view returns (bool) {
        return _verify(_type, _leaf(_addr), _proof);
    }

    // gets the leaf (i.e. the hashed output of the address)
    function _leaf(address _addr) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_addr));
    }

    // verifies the provided _proof to check if they are guaranteed/overallocated/not whitelisted.
    function _verify(uint8 _type, bytes32 _leaf, bytes32[] memory _proof) internal view returns (bool) {
        if (_type == 1) {
            return MerkleProof.verify(_proof, guaranteedMerkleRoot, _leaf);
        } else if (_type == 2) {
            return MerkleProof.verify(_proof, overallocatedMerkleRoot, _leaf);
        } else {
            revert InvalidMerkleType();
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, IERC721A, AccessControl, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}