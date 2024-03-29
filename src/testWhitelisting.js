const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// for testing purposes, these addresses are the first 4 in my metamask wallet + magic eden's account.
// excluding the deployer wallet
const guaranteedAddresses = [
    // account 1
    '0x8FbFE537A211d81F90774EE7002ff784E352024a',
    // account 2
    '0x213D2806B07fB2BFCd51fCbC7503755784C72F09',
    // TEST
    '0x2175cF248625c4cBefb204E76f0145b47d9061F8',
    // TEST 2
    '0xe253773Fdd10B4Bd9d7567e37003F7029144EF90',
    // TEST 3,
    '0x6FdCB216A701f6Beb805E6f4F3714cb1581cEb80',
    // MAGIC EDEN ACCOUNT,
    '0x0B1e16A648e940165aE8cfeD0b90ed695607b01e',
    // MAGIC EDEN ACCOUNT 2,
    '0xEfac1d54678De7Da41ba90cb17d4446695858457'
];

// for testing purposes, these addresses are the 5 - 8th in my metamask wallet
// excluding the deployer wallet
const oaAddresses = [
    // TEST 3
    '0x6FdCB216A701f6Beb805E6f4F3714cb1581cEb80',
    // TEST 4
    '0xD85Fbb429D2e53B49E343A6b3E68f03295Ad73F4',
    // Account 11
    '0xb3bf8cd8Ba8BD013F4C318ED3C75C3f154a502fA',
    // MAGIC EDEN ACCOUNT 2 (FROM GUARANTEED TO OA TEST)
    '0xEfac1d54678De7Da41ba90cb17d4446695858457',
    // MAGIC EDEN ACCOUNT 3
    '0xfaaF5D267adb442758548932CD9d9e90A28fB6ed',
]

// gets the leaf nodes of the guaranteed merkle tree
const guaranteedLeafNodes = guaranteedAddresses.map((addr) => keccak256(addr));
// gets the leaf nodes of the overallocated merkle tree
const oaLeafNodes = oaAddresses.map((addr) => keccak256(addr));

const guaranteedMerkleTree = new MerkleTree(guaranteedLeafNodes, keccak256, { sortPairs: true });
const oaMerkleTree = new MerkleTree(oaLeafNodes, keccak256, { sortPairs: true });

// console.log(guaranteedMerkleTree.toString());

const guaranteedRootHash = guaranteedMerkleTree.getHexRoot();
const oaRootHash = oaMerkleTree.getHexRoot();

console.log('Guaranteed Root Hash\n', guaranteedRootHash.toString());
console.log('Overallocated Root Hash\n', oaRootHash.toString());

// SHOULD BE RUN WHEN USERS WANT TO MINT
const proof = guaranteedMerkleTree.getHexProof(keccak256('0x0B1e16A648e940165aE8cfeD0b90ed695607b01e'));
console.log(proof);

module.exports = {
    guaranteedMerkleTree,
    oaMerkleTree,
}
