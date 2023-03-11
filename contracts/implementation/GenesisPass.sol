//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import '../nft-fundamentals/NFTMetadataCore.sol';
import '../security/AccessControl.sol';
import '../security/Pausable.sol';

contract GenesisPass is NFTMetadataCore, AccessControl, Pausable {
    constructor() ERC721A('Genesis Pass', 'KOS') {}

    /******EVENTS******** */
    event MintingAllowed(address _admin);
    event MintingNotAllowed(address _admin);
    event TransferTimestamp(uint256 _tokenId, address _from, address _to, uint256 _timestamp);
    /****************** */

    /**
     * @dev Key variables for the Genesis Pass.
     */
    uint16 public constant MAX_SUPPLY = 5000;
    uint8 public constant EACH_MINT_LIMIT = 1;
    uint16 public constant DEV_MINT_LIMIT = 500;
    bool public mintingAllowed;

    modifier whenMintingAllowed() {
        require(mintingAllowed, 'GP1');
        _;
    }

    modifier whenMintingNotAllowed() {
        require(!mintingAllowed, 'GP2');
        _;
    }

    function allowMinting() external whenMintingNotAllowed onlyAdmin {
        mintingAllowed = true;
        emit MintingAllowed(_msgSender());
    }

    function disallowMinting() external whenMintingAllowed onlyAdmin {
        mintingAllowed = false;
        emit MintingNotAllowed(_msgSender());
    }

    /********WHITELISTED ADDRESS VARIABLES AND LOGIC******* */
    enum WLType {
        Guaranteed,
        Overallocated
    }

    struct WLMinter {
        address addr;
        WLType wlType;
        bool hasMinted;
    }
    
    // profile of whitelisted addresses
    mapping (address => WLMinter) internal _wlProfile;

    function addOAMinters(address[] memory _addrs) external onlyAdmin {
        for (uint i = 0; i < _addrs.length; i++) {
            // only add if the address doesn't exist yet.
            if (_wlProfile[_addrs[i]].addr == address(0)) {
                _wlProfile[_addrs[i]] = WLMinter(_addrs[i], WLType.Overallocated, false);
            }
        }
    }

    function addGuaranteedMinters(address[] memory _addrs) external onlyAdmin {
        for (uint i = 0; i < _addrs.length; i++) {
            // only add if the address doesn't exist yet.
            if (_wlProfile[_addrs[i]].addr == address(0)) {
                _wlProfile[_addrs[i]] = WLMinter(_addrs[i], WLType.Guaranteed, false);
            }
        }
    }

    function removeOAMinters(address[] memory _addrs) external onlyAdmin {
        for (uint i = 0; i < _addrs.length; i++) {
            // only remove if the address exists.
            if (_wlProfile[_addrs[i]].addr != address(0)) {
                delete _wlProfile[_addrs[i]];
            }
        }
    }

    function removeGuaranteedMinters(address[] memory _addrs) external onlyAdmin {
        for (uint i = 0; i < _addrs.length; i++) {
            // only remove if the address exists.
            if (_wlProfile[_addrs[i]].addr != address(0)) {
                delete _wlProfile[_addrs[i]];
            }
        }
    }

    function convertToGuaranteed(address _addr) external onlyAdmin {
        require(_wlProfile[_addr].addr != address(0), 'GP7');
        require(_wlProfile[_addr].wlType == WLType.Overallocated, 'GP8');
        _wlProfile[_addr].wlType = WLType.Guaranteed;
    }

    function convertToOA(address _addr) external onlyAdmin {
        require(_wlProfile[_addr].addr != address(0), 'GP7');
        require(_wlProfile[_addr].wlType == WLType.Guaranteed, 'GP8');
        _wlProfile[_addr].wlType = WLType.Overallocated;
    }

    function getWLProfile(address _addr) external view returns (WLMinter memory) {
        return _wlProfile[_addr];
    }
    /*********************************************** */

    /*********MINT LIMIT REQUIREMENTS******** */
    modifier hasNotMinted() {
        require(!_wlProfile[_msgSender()].hasMinted, 'GP3');
        _;
    }

    modifier isGuaranteed() {
        require(_wlProfile[_msgSender()].wlType == WLType.Guaranteed, 'GP4');
        _;
    }

    modifier isOverallocated() {
        require(_wlProfile[_msgSender()].wlType == WLType.Overallocated, 'GP5');
        _;
    }

    modifier isBelowSupplyLimit() {
        require(totalSupply() < MAX_SUPPLY, 'GP6');
        _;
    }
    /**************************************** */

    /***********MINTING LOGIC*********************** */
    // for now, since we are not using chainlink, we will use block.timestamp to randomize the metadata.
    function guaranteedMint() external hasNotMinted isGuaranteed isBelowSupplyLimit whenMintingAllowed {
        uint256[] memory _numMetadata = generateLuck();

        WLMinter storage _minter = _wlProfile[_msgSender()];

        _mintGenesisPass(_msgSender(), _numMetadata);

        _minter.hasMinted = true;
    }

    function overallocatedMint() external hasNotMinted isOverallocated isBelowSupplyLimit whenMintingAllowed {
        uint256[] memory _numMetadata = generateLuck();

        WLMinter storage _minter = _wlProfile[_msgSender()];

        _mintGenesisPass(_msgSender(), _numMetadata);

        _minter.hasMinted = true;
    }

    function _mintGenesisPass(address _owner, uint256[] memory _numMetadata) private {
        _safeMint(_owner, 1);

        Metadata memory _gpMetadata = Metadata(
            new address[](0),
            _numMetadata,
            new string[](0),
            new bool[](0),
            new bytes32[](0)
        );

        _nftMetadata[totalSupply()] = _gpMetadata;
        emit TransferTimestamp(totalSupply(), address(0), _owner, block.timestamp);
    }

    function generateLuck() private view returns (uint256[] memory) {
        uint _luck = uint(keccak256(abi.encodePacked(block.timestamp, _msgSender(), block.number))) % 100 + 1;
        uint256[] memory _numMetadata = new uint256[](1);
        _numMetadata[0] = _luck;

        return _numMetadata;
    }
}