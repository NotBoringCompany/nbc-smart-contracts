require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const deployerAccount = process.env.DEPLOYER_WALLET;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'bscTestnet',
  networks: {
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [`0x${deployerAccount}`]
    }
  },
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
