const { ethers, artifacts } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { guaranteedMerkleTree, oaMerkleTree } = require('../src/testWhitelisting');
const fs = require('fs');
const path = require('path');

const parseJSON = (data) => JSON.parse(JSON.stringify(data));

async function main() {
    const kosAddress = '0xa8a7a9f5997aa2cC555A7aE2654fA6522F350546';
    const KOSContract = await ethers.getContractFactory('KeyOfSalvation');
    const kos = await KOSContract.attach(kosAddress);

    // const keychainAddress = '0xa61CDbbBC9907e417472c680804f854C0eBD5144';
    // const keychainContract = await ethers.getContractFactory('Keychain');
    // const keychain = await keychainContract.attach(keychainAddress);

    // const [deployer] = await ethers.getSigners();

    const rpcURL = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_API_KEY}`);
    // const rpcURL = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_API_KEY}`)

    const abi = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../src/kosABI.json'),
      )
    );

    const keychainAbi = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../src/keychainABI.json'),
      )
    );

    // const kosContract = new ethers.Contract(
    //   '0x7593af870c6c964363D8D4a7c6bb0B91623575c6',
    //   abi,
    //   rpcURL,
    // );

    // const keychainContract = new ethers.Contract(
    //   '0x071786f505589766e0E1654EdDCF576b6F484B7C',
    //   keychainAbi,
    //   rpcURL,
    // )

    /// KEYCHAIN STUFF
    // const mintDev = await keychain.devMintExt(['0x0aa260f4311074cb064b8f871efe444cc53c8483'], [5]);
    // console.log('mintDev: ', mintDev);

    // const setBaseURI = await keychain.setBaseURI('https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeial4ykkuecivqclh5kxplh6nwecdfn3rs5zwazk665lqv32cp6eje/keychain.json');
    // console.log('setBaseURI: ', setBaseURI);

    // const singleBatchTrfTest = await keychain.singleBatchTrf('0x8FbFE537A211d81F90774EE7002ff784E352024a', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // console.log('singleBatchTrfTest: ', singleBatchTrfTest);

    // const encodeTokenIds = ethers.utils.defaultAbiCoder.encode(['uint16[]'], [[11, 12, 13]]);

    // const multiBatchTrfTest = await keychain.multiBatchTrf(
    //   [
    //     '0x2175cF248625c4cBefb204E76f0145b47d9061F8',
    //     '0x460107fAB29D57a6926DddC603B7331F4D3bCA05',
    //     '0x8FbFE537A211d81F90774EE7002ff784E352024a'
    //   ],
    //   encodeTokenIds
    // )

    // console.log('multiBatchTrfTest: ', multiBatchTrfTest);

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

    // const changeStage = await kos.setRevealStage(1);
    // console.log('changeStage: ', changeStage);

    // const increaseDevmint = await kos.changeDevMintLimit(5000);
    // console.log('increaseDevmint: ', increaseDevmint);

    // const devMint = await kos.devMint(4999);
    // console.log('devMint: ', devMint);

    const setRvlStage = await kos.setRevealStage(2);
    console.log('setRvlStage: ', setRvlStage);

    const baseURIChange = await kos.setBaseURI(3, 'https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeie4eh6kgysfskhlnvjtw63vgfnrviwd4webbfvvouda646ke5fx7m/');
    console.log('baseURIChange: ', baseURIChange);

    // const setBaseURIToStage2 = await kos.setBaseURI(2, 'https://silver-odd-bee-580.mypinata.cloud/ipfs/bafybeihbyjxt6xgc6ubeigxfwmpqwqkokg2robwbcfxilkwhlmym6hvhbi/');
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