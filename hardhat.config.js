require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const deployerAccount = process.env.DEPLOYER_WALLET;
const ganacheWallet = process.env.GANACHE_WALLET_0x32;
const account2Wallet = process.env.ACCOUNT_2_WALLET;
const testWallet = process.env.TEST_WALLET;
const test2Wallet = process.env.TEST_2_WALLET;
const test3Wallet = process.env.TEST_3_WALLET;
const test4Wallet = process.env.TEST_4_WALLET;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'bscTestnet',
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    // apiKey: process.env.BSCSCAN_API_KEY,
    // apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  networks: {
    ethereum: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ETH_API_KEY}`,
      chainId: 1,
      gasPrice: 32000000000,
      accounts: [
        `0x${deployerAccount}`
      ]
    },
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [
        // `0x${account2Wallet}`, 
        `0x${deployerAccount}`
      ]
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGON_ALCHEMY_API_KEY}`,
      chainId: 137,
      gasPrice: 500000000000,
      accounts: [
        // `0x${account2Wallet}`,
        // `0x${testWallet}`,
        // `0x${test2Wallet}`
        `0x${test3Wallet}`,
        // `0x${test4Wallet}`
        // `0x${deployerAccount}`
      ]
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_API_KEY}`,
      chainId: 80001,
      gasPrice: 20000000000,
      accounts: [
        // `0x${account2Wallet}`,
        // `0x${testWallet}`,
        // `0x${test2Wallet}`
        // `0x${test3Wallet}`,
        // `0x${test4Wallet}`
        `0x${deployerAccount}`
      ],
    },
    goerli: {
      // url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 5,
      gasPrice: 20000000000,
      accounts: [
        // `0x${account2Wallet}`, 
        `0x${deployerAccount}`
      ]
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_API_KEY}`,
      chainId: 11155111,
      gasPrice: 29000000000,
      accounts: [
        // `0x${account2Wallet}`, 
        `0x${deployerAccount}`
      ]
    },
    ganache: {
      url: 'HTTP://127.0.0.1:7545',
      chainId: 1337,
      gasPrice: 20000000000,
      accounts: [`0x${ganacheWallet}`]
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
