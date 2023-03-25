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
import '@openzeppelin/contracts/interfaces/IERC20.sol';


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
    // called when address specified is not whitelisted for guaranteed
    error NotWhitelistedForGuaranteed();
    // called when address specified is not whitelisted for overallocated
    error NotWhitelistedForOverallocated();
    // called when address specified has already minted
    error AlreadyMinted();
    // two merkle types: guaranteed and overallocated root
    error InvalidMerkleType();
    // called when guaranteed mint is not allowed
    error NotGuaranteedMint();
    // called when guaranteed mint is already running
    error GuaranteedMintAlready();
    // called when overallocated mint is already running
    error OverallocatedMintAlready();
    // guaranteed mint must be off when overallocated is on.
    error GuaranteedMintMustBeOff();
    // overallocated mint must be off when guaranteed is on.
    error OverAllocatedMintMustBeOff();
    // called when overallocated mint is not allowed
    error NotOverallocatedMint();
    // transferring ownership to zero address
    error TransferOwnershipToZeroAddress();
    // when mint is already closed, cannot change mint status
    error MintAlreadyClosed();
    // called when reveal stage is invalid
    error InvalidRevealStage();

    /**
     * @dev Key variables for the Key.
     */
    // max supply of the key
    uint16 public constant MAX_SUPPLY = 5000;
    // max supply a dev can mint
    uint16 public constant DEV_MINT_LIMIT = 500;
    // check if an address has already minted (guaranteed or overallocated)
    mapping (address => uint256) public whitelistMinted;
    MintStatus public mintStatus;
    // the current status of mint
    enum MintStatus {
        NOT_STARTED,
        GUARANTEED,
        OVERALLOCATED,
        CLOSED
    }
    // starts at STAGE_1.
    RevealStage public revealStage = RevealStage.STAGE_1;
    // reveal stages
    enum RevealStage {
        // not revealed
        STAGE_1,
        // revealed the key type and house
        STAGE_2,
        // revealed the luck trait
        STAGE_3
    }

    constructor(uint96 defaultRoyalty_) ERC721A('Key Of Salvation', 'KOS') OperatorFilterer(0x0000000000000000000000000000000000000000, false) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setDefaultRoyalty(_msgSender(), defaultRoyalty_);
    }

    // changes start token from 0 to 1.
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    // sets the reveal stage of the key.
    function setRevealStage(RevealStage _stage) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_stage != RevealStage.STAGE_2 || _stage != RevealStage.STAGE_3) {
            revert InvalidRevealStage();
        } 
        revealStage = _stage;
    }

    // changes the mint status
    function setMintStatus(MintStatus _status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (mintStatus == MintStatus.CLOSED) {
            revert MintAlreadyClosed();
        }
        mintStatus = _status;
    }

    // mints a key to a guaranteed WL holder.
    function guaranteedMint(bytes32[] calldata _proof) external {
        if (mintStatus != MintStatus.GUARANTEED) {
            revert NotGuaranteedMint();
        }

        // checks if the address is whitelisted for guaranteed
        if (!_isWhitelisted(1, _msgSender(), _proof)) {
            revert NotWhitelistedForGuaranteed();
        }

        // checks if address has already minted
        if (whitelistMinted[_msgSender()] > 0) {
            revert AlreadyMinted();
        }

        whitelistMinted[_msgSender()] = nextTokenId();
        _safeMint(false, _msgSender(), 1);
    }

    // mints a key to an overallocated WL holder.
    function overallocatedMint(bytes32[] calldata _proof) external {
        if (mintStatus != MintStatus.OVERALLOCATED) {
            revert NotOverallocatedMint();
        }

        // checks if the address is whitelisted for OA
        if (!_isWhitelisted(2, _msgSender(), _proof)) {
            revert NotWhitelistedForOverallocated();
        }

        // checks if address has already minted
        if (whitelistMinted[_msgSender()] > 0) {
            revert AlreadyMinted();
        }

        whitelistMinted[_msgSender()] = nextTokenId();
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
        return _verify(_type, _getLeaf(_addr), _proof);
    }

    // gets the leaf (i.e. the hashed output of the address)
    function _getLeaf(address _addr) internal pure returns (bytes32) {
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

    /// TOKEN URI FUNCTIONS
    string private _contractURI;
    string private _stage1RevealURI;
    string private _stage2RevealURI;
    string private _stage3RevealURI;

    function tokenURI(uint256 _tokenId) public view virtual override(ERC721A, IERC721A) returns (string memory) {
        if (!_exists(_tokenId)) {
            revert URIQueryForNonexistentToken();
        }

        string memory baseURI_ = _baseURI();
        return bytes(baseURI_).length > 0 ? string(abi.encodePacked(baseURI_, _tokenId.toString(), '.json')) : '';
    }

    function _baseURI() internal view override returns (string memory) {
        if (revealStage == RevealStage.STAGE_1) {
            return _stage1RevealURI;
        } else if (revealStage == RevealStage.STAGE_2) {
            return _stage2RevealURI;
        } else {
            return _stage3RevealURI;
        }
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function setBaseURI(uint8 _type, string memory _uri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_type == 1) {
            _stage1RevealURI = _uri;
        } else if (_type == 2) {
            _stage2RevealURI = _uri;
        } else if (_type == 3) {
            _stage3RevealURI = _uri;
        } else {
            revert InvalidRevealStage();
        }
    }

    // contract URI for opensea
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function setContractURI(string calldata contractURI_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _contractURI = contractURI_;
    }
    /// End of TOKEN URI FUNCTIONS

    function setDefaultRoyalty(address _receiver, uint96 _feeNumerator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setDefaultRoyalty(_receiver, _feeNumerator);
    }

    function setApprovalForAll(address _operator, bool _approved) public override(ERC721A, IERC721A) onlyAllowedOperatorApproval(_operator) {
        super.setApprovalForAll(_operator, _approved);
    }

    function approve(address _operator, uint256 _tokenId) public payable override(ERC721A, IERC721A) onlyAllowedOperatorApproval(_operator) {
        super.approve(_operator, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public payable override(ERC721A, IERC721A) onlyAllowedOperator(_from) {
        super.transferFrom(_from, _to, _tokenId);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public payable override(ERC721A, IERC721A) onlyAllowedOperator(_from) {
        super.safeTransferFrom(_from, _to, _tokenId);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory _data) public payable override(ERC721A, IERC721A) onlyAllowedOperator(_from) {
        super.safeTransferFrom(_from, _to, _tokenId, _data);
    }

     /********* WITHDRAWALS*************** */
    /// withdraws balance from this contract to admin.
    /// Note: Please do NOT send unnecessary funds to this contract.
    /// This is used as a mechanism to transfer any balance that this contract has to admin.
    /// we will NOT be responsible for any funds transferred accidentally unless notified immediately.
    function withdrawFunds() external onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(_msgSender()).transfer(address(this).balance);
    }

    /// withdraws tokens from this contract to admin.
    /// Note: Please do NOT send unnecessary tokens to this contract.
    /// This is used as a mechanism to transfer any tokens that this contract has to admin.
    /// we will NOT be responsible for any tokens transferred accidentally unless notified immediately.
    function withdrawTokens(address _tokenAddr, uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20 _token = IERC20(_tokenAddr);
        _token.transfer(_msgSender(), _amount);
    }
    /**************************************** */

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, IERC721A, AccessControl, ERC2981) returns (bool) {
        return 
            interfaceId == type(IAccessControl).interfaceId ||
            interfaceId == type(IERC721A).interfaceId ||
            interfaceId == type(IERC2981).interfaceId ||
            interfaceId == type(IERC165).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}