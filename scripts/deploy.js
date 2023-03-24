const hre = require('hardhat');
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account: ', deployer.address);
  const balance = await deployer.getBalance();
  console.log('Account balance: ', (balance / 10 ** 18).toString());

  // Key Of Salvation contract
  const KeyOfSalvation = await ethers.getContractFactory('KeyOfSalvation');
  const keyOfSalvation = await KeyOfSalvation.deploy(500, '', '');

  await keyOfSalvation.deployed();
  console.log('KeyOfSalvation address: ', keyOfSalvation.address);

  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await keyOfSalvation.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

  console.log('Verifying KeyOfSalvation contract...');

  await run(`verify:verify`, {
    address: keyOfSalvation.address,
    constructorArguments: [500, '', ''],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
