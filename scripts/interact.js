const { ethers } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { guaranteedMerkleTree } = require('../src/testWhitelisting');
const fs = require('fs');
const path = require('path');

const parseJSON = (data) => JSON.parse(JSON.stringify(data));

async function main() {
    // const kosAddress = '0x1a921715AC693532f9c9c682dc9428b746fdAaeE';
    // const KOSContract = await ethers.getContractFactory('KeyOfSalvation');
    // const kos = await KOSContract.attach(kosAddress);

    // const [deployer] = await ethers.getSigners();

    const rpcURL = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_API_KEY}`);

    const abi = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../src/kosABI.json'),
      )
    );

    const kosContract = new ethers.Contract(
      '0x1a921715AC693532f9c9c682dc9428b746fdAaeE',
      abi,
      rpcURL,
    );

    // const allowGuaranteedMint = await kos.setMintStatus(1);
    // console.log('allowGuaranteedMint: ', allowGuaranteedMint);

    // const tryGuaranteedMint = await kos.guaranteedMint(
    //   guaranteedMerkleTree.getHexProof(keccak256('0x2175cF248625c4cBefb204E76f0145b47d9061F8')),
    // );

    // console.log('tryGuaranteedMint: ', tryGuaranteedMint);

    const trf = await kosContract['safeTransferFrom(address, address, uint256)']('0x213D2806B07fB2BFCd51fCbC7503755784C72F09', '0xe253773Fdd10B4Bd9d7567e37003F7029144EF90', 1);
    console.log('trf: ', trf);

    // const changeContractURI = await kos.setContractURI('https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeifr5nfj5sm25itd5mkxjsrgwcevy6rziw5ek6fhv5ov66cxadn5o4/kos.json');
    // console.log('changeContractURI: ', changeContractURI);

    // const setBaseURI = await kos.setBaseURI(1, 'https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeifr5nfj5sm25itd5mkxjsrgwcevy6rziw5ek6fhv5ov66cxadn5o4/');
    // console.log('setBaseURI: ', setBaseURI);

    // // change guaranteed merkle tree root hash to the wl addresses in `testWhitelisting`
    // const changeGuaranteedRoot = await kos.setMerkleRoot(1, '0x02b84df9abb879d43dd869ced2fb5cc0fac806a8e1191fa5391850614527821e');
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