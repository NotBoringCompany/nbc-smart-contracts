require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const deployerAccount = process.env.DEPLOYER_WALLET;
const ganacheWallet = process.env.GANACHE_WALLET_0x32;
const account2Wallet = process.env.ACCOUNT_2_WALLET;
const testWallet = process.env.TEST_WALLET;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'bscTestnet',
  etherscan: {
    // apiKey: process.env.ETHERSCAN_API_KEY,
    // apiKey: process.env.BSCSCAN_API_KEY,
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  networks: {
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
      gasPrice: 100000000000,
      accounts: [
        // `0x${account2Wallet}`,
        `0x${testWallet}`,
        // `0x${deployerAccount}`
      ]
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_API_KEY}`,
      chainId: 80001,
      gasPrice: 20000000000,
      accounts: [
        `0x${account2Wallet}`,
        // `0x${testWallet}`,
        // `0x${deployerAccount}`
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
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 11155111,
      gasPrice: 20000000000,
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
