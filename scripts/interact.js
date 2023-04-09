const { ethers, artifacts } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { guaranteedMerkleTree, oaMerkleTree } = require('../src/testWhitelisting');
const fs = require('fs');
const path = require('path');

const parseJSON = (data) => JSON.parse(JSON.stringify(data));

async function main() {
    const kosAddress = '0x7593af870c6c964363D8D4a7c6bb0B91623575c6';
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
      '0x7593af870c6c964363D8D4a7c6bb0B91623575c6',
      abi,
      rpcURL,
    );

    // const allowGuaranteedMint = await kos.setMintStatus(1);
    // console.log('allowGuaranteedMint: ', allowGuaranteedMint);

    // const hexProof = guaranteedMerkleTree.getHexProof(keccak256('0x213DB2BFCd51fCbC7503755784C72F09'));
    // console.log('hexProof: ', hexProof);

    // const devMint = await kos.devMint(1);
    // console.log('devMint: ', devMint);

    // const changeGuaranteedTimestamp = await kos.changeGuaranteedMintTimestamp(1680789600);
    // console.log('changeGuaranteedTimestamp: ', changeGuaranteedTimestamp);

    // const checkOverallocatedMerkleRoot = await kos.overallocatedMerkleRoot();
    // console.log('checkOverallocatedMerkleRoot: ', checkOverallocatedMerkleRoot);

    // const changeOverallocatedTimestamp = await kos.changeOverallocatedMintTimestamp(1680810300);
    // console.log('changeOverallocatedTimestamp: ', changeOverallocatedTimestamp);

    // const changeEndTimestamp = await kos.changeEndMintTimestamp(1680810600);
    // console.log('changeEndTimestamp: ', changeEndTimestamp);

    // const getEndTimestamp = await kos.endMintTimestamp();
    // console.log('getEndTimestamp: ', getEndTimestamp);

    // const tryGuaranteedMint = await kos.guaranteedMint(
    //   guaranteedMerkleTree.getHexProof(keccak256('0x6FdCB216A701f6Beb805E6f4F3714cb1581cEb80')),
    // );
    // console.log('tryGuaranteedMint: ', tryGuaranteedMint);

    // const tryOverallocatedMint = await kos.overallocatedMint(
    //   oaMerkleTree.getHexProof(keccak256('0xD85fBB429D2e53B49E343A6b3E68f03295Ad73F4'))
    // );

    // console.log('tryOverallocatedMint: ', tryOverallocatedMint);

    // const trf = await kosContract.connect(deployer)['safeTransferFrom(address,address,uint256)'](deployer.address, '0x2175cF248625c4cBefb204E76f0145b47d9061F8', 1);
    // console.log('trf: ', trf);

    // const changeContractURI = await kos.setContractURI('https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeicwys5fdypz25jcxyty7vzcttnpjk3spgymsd7ysvmtfjjdyjyzau/contract.json');
    // console.log('changeContractURI: ', changeContractURI);

    // const changeStage = await kos.setRevealStage(0);
    // console.log('changeStage: ', changeStage);

    // const setBaseURIToStage2 = await kosContract.connect(deployer).setBaseURI(2, 'https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeiaf4hvzrvy2t65fro7lxqwnkwvbxr35sadgynu2bpovbpaqmmht7q/');
    // console.log('setBaseURI: ', setBaseURIToStage2);

    // const setBaseURI = await kos.setBaseURI(1, 'https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeidhgtjpp7pubdkh2m7mqjoonjary2tpo4jnmnw2kb3wquo4srtizu/metadata.json');
    // console.log('setBaseURI: ', setBaseURI);

    // const checkBaseUri = await kos.baseURI();
    // console.log('checkBaseUri: ', checkBaseUri);

    // // change guaranteed merkle tree root hash to the wl addresses in `testWhitelisting`
    // const changeGuaranteedRoot = await kos.setMerkleRoot(1, '0x39cba08bb4f885e7ea70e47eb4108df0148d391c5c87527bb3a88fab2cf821a9');
    // console.log('changeGuaranteedRoot: ', changeGuaranteedRoot);

    // // change overallocated merkle tree root hash to the wl addresses in `testWhitelisting`
    // const changeOverallocatedRoot = await kos.setMerkleRoot(2, '0xe8d5fbf308bad8e1e83be50035819fb928e22f756fd9c60565a03767b39cf6fb');
    // console.log('changeOverallocatedRoot: ', changeOverallocatedRoot);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });