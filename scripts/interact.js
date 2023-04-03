const { ethers, artifacts } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { guaranteedMerkleTree } = require('../src/testWhitelisting');
const fs = require('fs');
const path = require('path');

const parseJSON = (data) => JSON.parse(JSON.stringify(data));

async function main() {
    const kosAddress = '0xa8a7a9f5997aa2cC555A7aE2654fA6522F350546';
    const KOSContract = await ethers.getContractFactory('KeyOfSalvation');
    const kos = await KOSContract.attach(kosAddress);

    const [deployer] = await ethers.getSigners();

    const rpcURL = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_API_KEY}`);

    const abi = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../src/kosABI.json'),
      )
    );

    const kosContract = new ethers.Contract(
      '0xa8a7a9f5997aa2cC555A7aE2654fA6522F350546',
      abi,
      rpcURL,
    );

    // const allowGuaranteedMint = await kos.setMintStatus(1);
    // console.log('allowGuaranteedMint: ', allowGuaranteedMint);

    // const hexProof = guaranteedMerkleTree.getHexProof(keccak256('0x213DB2BFCd51fCbC7503755784C72F09'));
    // console.log('hexProof: ', hexProof);

    // const devMint = await kos.devMint(1);
    // console.log('devMint: ', devMint);

    // const changeGuaranteedTimestamp = await kos.changeGuaranteedMintTimestamp(1680537300);
    // console.log('changeGuaranteedTimestamp: ', changeGuaranteedTimestamp);

    // const changeOverallocatedTimestamp = await kos.changeOverallocatedMintTimestamp(1680537900);
    // console.log('changeOverallocatedTimestamp: ', changeOverallocatedTimestamp);

    const tryGuaranteedMint = await kos.guaranteedMint(
      guaranteedMerkleTree.getHexProof(keccak256('0x2175cF248625c4cBefb204E76f0145b47d9061F8')),
    );
    console.log('tryGuaranteedMint: ', tryGuaranteedMint);

    // const trf = await kosContract.connect(deployer)['safeTransferFrom(address,address,uint256)'](deployer.address, '0x2175cF248625c4cBefb204E76f0145b47d9061F8', 1);
    // console.log('trf: ', trf);

    // const changeContractURI = await kos.setContractURI('https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeifr5nfj5sm25itd5mkxjsrgwcevy6rziw5ek6fhv5ov66cxadn5o4/kos.json');
    // console.log('changeContractURI: ', changeContractURI);

    // const changeStage = await kosContract.connect(deployer)['setRevealStage(uint8)'](2);
    // console.log('changeStage: ', changeStage);

    // const setBaseURI = await kosContract.connect(deployer).setBaseURI(1, 'https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeiakr662765sqiqocsjdzlfffamvu2dgexq4rnss4zwdqohpyd276m/metadata.json');
    // console.log('setBaseURI: ', setBaseURI);

    // // change guaranteed merkle tree root hash to the wl addresses in `testWhitelisting`
    // const changeGuaranteedRoot = await kos.setMerkleRoot(1, '0xf4e63e77429fb1dd2f25b589799fd147ecca1a128d1e60b4d868d91289ffe427');
    // console.log('changeGuaranteedRoot: ', changeGuaranteedRoot);

    // // change overallocated merkle tree root hash to the wl addresses in `testWhitelisting`
    // const changeOverallocatedRoot = await kos.setMerkleRoot(2, '0x5f5e80c16033360f32e5575a5fef18781aa2639d5fe50f504452ec199eeaf414');
    // console.log('changeOverallocatedRoot: ', changeOverallocatedRoot);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });