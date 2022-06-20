const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config() // 解析.env

module.exports = {
  compilers: {
    solc: {
      version: "^0.8.4",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  mocha: {
    timeout: 100000
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.RINKEBY_APIKEY,
    bscscan: process.env.BSCTEST_APIKEY,
    hecoinfo: process.env.HECOTEST_APIKEY
  },
  networks: {
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.PRIVKEY, `https://rinkeby.infura.io/v3/457c1ac43c544b05abfef0163084a7a6`),
      network_id: 4,
      skipDryRun: true
    },
    bscTest: {
      provider: () => new HDWalletProvider(process.env.PRIVKEY, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(process.env.PRIVKEY, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    hecoTest: {//验证失败
      provider: () => new HDWalletProvider(process.env.PRIVKEY, `https://http-testnet.hecochain.com/`),
      network_id: 256,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
}
