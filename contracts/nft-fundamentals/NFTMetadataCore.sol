//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import './ERC721AURIStorage.sol';

/**
 * @title NFTMetadata
 * @dev Core metadata extension and data structure for NBC's NFTs using ERC721A.
 */
abstract contract NFTMetadataCore is ERC721AURIStorage {
    /**
     * METADATA STRUCTURE FOR ALL NFTS.
     * Dynamic way of storing metadata contract-level.
     */
    struct Metadata {
        address[] addrMetadata;
        uint256[] numMetadata;
        string[] strMetadata;
        bool[] boolMetadata;
        bytes32[] bytesMetadata;
    }

    // mapping from token ID to Metadata
    mapping (uint256 => Metadata) private _nftMetadata;
}