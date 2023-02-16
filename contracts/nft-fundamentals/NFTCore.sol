//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import './ERC721AURIStorage.sol';

/**
 * @title NFTCore
 * @dev Core functionality and data structure for NBC's NFTs.
 */
abstract contract NFTCore is ERC721AURIStorage {
    /**
     * @dev Instance of the NFT.
     */
    struct NFT {
        // name of NFT. Will follow contract's name
        string nftName;
        uint256 tokenId;
        address owner;
        uint256 bornAt;
        // changes when transferred (e.g. from buying/selling the NFT)
        uint256 transferredAt;
        // checks if NFT is currently being sold
        // Note: only works on NBC's marketplace
        bool onSale;
        /// TYPE-SPECIFIC METADATA CONTENT OF THE NFT
        /// since different NFTs have different metadata, we need a dynamic way to store them.
        address[] addressMetadata;
        string[] stringMetadata;
        uint256[] numericMetadata;
        bool[] boolMetadata;
        bytes32[] bytesMetadata;
    }
}