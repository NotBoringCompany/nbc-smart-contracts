const { ethers, artifacts } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { guaranteedMerkleTree, oaMerkleTree } = require('../src/testWhitelisting');
const fs = require('fs');
const path = require('path');

const parseJSON = (data) => JSON.parse(JSON.stringify(data));

async function main() {
    const kosAddress='0x34BFF2Dbf20cF39dB042cb68D42D6d06fdbd85D3';
    const KOSContract = await ethers.getContractFactory('KeyOfSalvation');
    const kos = await KOSContract.attach(kosAddress);

    const [deployer] = await ethers.getSigners();

    const rpcUrl = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ETH_API_KEY}`);

    const abi = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../src/kosABI.json'),
        )
    );

    const kosContract = new ethers.Contract(
        '0x34BFF2Dbf20cF39dB042cb68D42D6d06fdbd85D3',
        abi,
        rpcUrl,
    );

    // 1. change base URI
    // const changeURI = await kos.setBaseURI(1, 'https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeighwlu645q62syp5kdcdwsxephzp47gmrzc37ju6y7vtemxizfcsa/metadata.json');
    // console.log('changeURI: ', changeURI);

    // 2. change contract URI
    // const changeContractURI = await kos.setContractURI('https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeidt4geejy5wsnpt5vjzubwosxffkpmpaye6vglsy27q3vqts2mcca/contract.json');
    // console.log('changeContractURI: ', changeContractURI);

    // // 3. mint 500 to dev
    // const mint500 = await kos.devMint(500);
    // console.log('mint500: ', mint500);

    // 4. merkle root change for guaranteed
    // const changeGuaranteedMerkleRoot = await kos.setMerkleRoot(1, '0x0');
    // console.log('changeGuaranteedMerkleRoot: ', changeGuaranteedMerkleRoot);

    // // 5. overallocated mint timestamp change
    // const changeOverallocatedMintTimestamp = await kos.changeOverallocatedMintTimestamp(1680924600);
    // console.log('changeOverallocatedMintTimestamp: ', changeOverallocatedMintTimestamp);

    // // 6. change end mint timestamp
    // const changeEndMintTimestamp = await kos.changeEndMintTimestamp(1680946200);
    // console.log('changeEndMintTimestamp: ', changeEndMintTimestamp);

    // // 7. change OA merkle root
    // const changeOAMerkleRoot = await kos.setMerkleRoot(2, '0xacd8b25011db67a47618291d79e0c94b6b9aed010bc2a9896231246b408359aa');
    // console.log('changeOAMerkleRoot: ', changeOAMerkleRoot);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    })