var EthereumTx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const Common = require('ethereumjs-common').default;

// const bscChainId = 56 // 主网
const bscChainId = 97 // 测试网

// const rpc = 'https://bsc-dataseed.binance.org'
const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

const pkOwner = ''   // 合约创建者地址私钥
const pkPreSale = '' // 合约预售地址私钥
const pkAirdrop = '' // 合约空投地址私钥

// const owner = '0xb3a7C64F9065c0a6A9EB57597943A3d187733238'     // 总地址
const owner = '0x5e757A0DEc95Bf3a9699cf4cA7147a1F92Ce82a9'        // 总地址

// const A = '0x182AD90BFBFC9b972fE5298A0825314d5dDA3642'         // 预售地址
const A = '0xEEA13450C12335B28B1162ef56B80aaC9AFd0C10'            // 预售地址

// const D = '0x06aD629119493cCc0bc5423aeAd7e37cf31CEBAE'         // 空投地址
const D = '0x5AFbA347450A2299c1A2b827eafEf3835BB85668'            // 空投地址


const contractAddress = '0xc4a64752Ff2e476fbAB56e09e1592d0B68f73C73' // BYDK合约地址
const preSaleAddress = '0x021874f17efeCBB9b8CCdEAd93A5C4E3d99B9afD'  // 预售合约地址
const exchangeAddress = '0x09a1ee116899B905263400964C8C9be139febF2e' // 置换合约地址



const contractABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "fundAddress_",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "actionAddress_",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "_biddingFree",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_blackHoleFree",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_burnMinLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_directPushFree",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_fundFree",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_indirectPushFree",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_maxTxAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_shareFree",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupplyReflection",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isExcludedFromReward",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalFees",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "minLimit",
          "type": "uint256"
        }
      ],
      "name": "setBurnMinLimit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "maxTxAmount",
          "type": "uint256"
        }
      ],
      "name": "setMaxTxAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "excludeFromReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "includeInReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "shareFree_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "directPushFree_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "indirectPushFree_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "blackHoleFree_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "fundFree_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "biddingFree_",
          "type": "uint256"
        }
      ],
      "name": "setTaxFeePercent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "rAmount",
          "type": "uint256"
        }
      ],
      "name": "tokenFromReflection",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

const preSaleContractABI = []

const B = "0x8C2B33a09dA1Be414591204424f36b1F7dA14241"            // 技术地址
const C = "0x1ec9dcf7DCd28AFb87E96511BfF3494423d2B50A"            // 风投地址
const E = "0xf71BD23CF2322FF8ff2EB42Cda7b0157956b7449"            // 社区地址
const F = "0x3ce4b119488C10a62fE379a26cF99ba3bEd2E834"            // D池地址
const G = "0xc49E8851983c7aD445a1697bfF0Aacc85182C4CF"            // 游戏地址
const H = "0xD986Cfb4c7C370A6A81e24032d61836744D63647"            // 基金地址
const I = "0x144255298efF5AFd8000B9fba74e4a4F2aFD6b20"            // 竞拍地址
const zero = "0x0000000000000000000000000000000000000000"         // 零地址
const share1_ = "0xB4a4a4f7eB75994855Bb99A61EBDCEcF499FeFbD"            // 股东1
const share2_ = "0x69B1f31ae550BEf5F254bbF95173520fbb945Aa5"            // 股东2
const share3_ = "0x1Bc29671F73A42c515C969f19Ca8056A27f848c1"            // 股东3
const share4_ = "0x1759862A95a03D322EED0C9357A64C21C509b588"            // 股东4
const web3 = new Web3(rpc)
const privateKeyOwner = Buffer.from(pkOwner, 'hex')
const privateKeyPreSale = Buffer.from(pkPreSale, 'hex')
const privateKeyAirdrop = Buffer.from(pkAirdrop, 'hex')

// 转账
async function transfer(from, to, amount, privateKey) {
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const nonce = await web3.eth.getTransactionCount(from, 'pending')
    const gasPrice = await web3.eth.getGasPrice()
    const data = contract.methods.transfer(to, amount).encodeABI()
    // 创建交易对象
    const txObject = {
        from: from,
        nonce:    web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(gasPrice),
        to: contractAddress,
        value: '0x00',
        data: data
    }

    const BSC = Common.forCustomChain(
    'mainnet',
    {
        name: 'Binance Smart Chain Testnet',
        networkId: bscChainId,
        chainId: bscChainId,
        url: rpc
    },
    'istanbul',
    );

    // 签署交易
    const tx = new EthereumTx(txObject, {'common': BSC})
    tx.sign(privateKey)
    const serializedTx = tx.serialize()

    // 广播交易
    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        console.log('txHash:', txHash, 'err:', err)
    })
}

// 排除分红地址
async function excludeFromReward(from, to, privateKey) {
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const nonce = await web3.eth.getTransactionCount(from, 'pending')
    const gasPrice = await web3.eth.getGasPrice()
    const data = contract.methods.excludeFromReward(to).encodeABI()
    
    // 创建交易对象
    const txObject = {
        from: from,
        nonce:    web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(gasPrice),
        to: contractAddress,
        value: '0x00',
        data: data
    }

    const BSC = Common.forCustomChain(
    'mainnet',
    {
        name: 'Binance Smart Chain Testnet',
        networkId: bscChainId,
        chainId: bscChainId,
        url: rpc
    },
    'istanbul',
    );

    // 签署交易
    const tx = new EthereumTx(txObject, {'common': BSC})
    tx.sign(privateKey)
    const serializedTx = tx.serialize()

    // 广播交易
    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        console.log('txHash:', txHash, 'err:', err)
    })
}

// 授权
async function approve(from, to, amount, privateKey) {
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const nonce = await web3.eth.getTransactionCount(from, 'pending')
    const gasPrice = await web3.eth.getGasPrice()
    const data = contract.methods.approve(to, amount).encodeABI()

    const txObject = {
        from: from,
        nonce:    web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(gasPrice),
        to: contractAddress,
        value: '0x00',
        data: data
    }

    const BSC = Common.forCustomChain(
    'mainnet',
    {
        name: 'Binance Smart Chain Testnet',
        networkId: bscChainId,
        chainId: bscChainId,
        url: rpc
    },
    'istanbul',
    );

    // 签署交易
    const tx = new EthereumTx(txObject, {'common': BSC})
    tx.sign(privateKey)
    const serializedTx = tx.serialize()

    // 广播交易
    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        console.log('txHash:', txHash, 'err:', err)
    })
}

// 设置股东地址
async function setShareAddress(from, to, privateKey) {
  const contract = new web3.eth.Contract(preSaleContractABI, preSaleAddress)
  const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const gasPrice = await web3.eth.getGasPrice()
  const data = contract.methods.setShareAddress(to).encodeABI()

  const txObject = {
      from: from,
      nonce:    web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(8000000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: preSaleAddress,
      value: '0x00',
      data: data
  }

  const BSC = Common.forCustomChain(
  'mainnet',
  {
      name: 'Binance Smart Chain Testnet',
      networkId: bscChainId,
      chainId: bscChainId,
      url: rpc
  },
  'istanbul',
  );

  // 签署交易
  const tx = new EthereumTx(txObject, {'common': BSC})
  tx.sign(privateKey)
  const serializedTx = tx.serialize()

  // 广播交易
  await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      console.log('txHash:', txHash, 'err:', err)
  })
}


async function call() {
    console.log('-----------------------排除分红地址  开始-----------------------------')
    await excludeFromReward(owner, owner, privateKeyOwner)              // 排除总地址
    await excludeFromReward(owner, A, privateKeyOwner)                  // 排除预售地址
    await excludeFromReward(owner, B, privateKeyOwner)                  // 排除技术地址
    await excludeFromReward(owner, C, privateKeyOwner)                  // 排除风投地址
    await excludeFromReward(owner, D, privateKeyOwner)                  // 排除空投地址
    await excludeFromReward(owner, E, privateKeyOwner)                  // 排除社区地址
    await excludeFromReward(owner, F, privateKeyOwner)                  // 排除D池地址
    await excludeFromReward(owner, G, privateKeyOwner)                  // 排除游戏地址
    await excludeFromReward(owner, H, privateKeyOwner)                  // 排除基金地址
    await excludeFromReward(owner, I, privateKeyOwner)                  // 排除竞拍地址
    await excludeFromReward(owner, exchangeAddress, privateKeyOwner)    // 排除置换合约地址
    console.log('-----------------------排除分红地址  结束-----------------------------')

    console.log('-----------------------转账  开始------------------------')
    await transfer(owner, A, '1200000000000000000000000', privateKeyOwner)    // 预售地址
    await transfer(owner, B, '60000000000000000000000', privateKeyOwner)      // 技术地址
    await transfer(owner, C, '40000000000000000000000', privateKeyOwner)      // 风投地址
    await transfer(owner, D, '60000000000000000000000', privateKeyOwner)      // 空投地址
    await transfer(owner, E, '40000000000000000000000', privateKeyOwner)      // 社区地址
    await transfer(owner, F, '20000000000000000000000', privateKeyOwner)      // 排除D池地址
    await transfer(owner, zero, '580000000000000000000000', privateKeyOwner)  // 游戏地址
    console.log('-----------------------转账  结束-------------------------')

    // console.log('-----------------------授权  开始-----------------------------')
    // await approve(A, preSaleAddress, '1200000000000000000000000', privateKeyPreSale)  // 预售地址授权预售合约
    // await approve(D, preSaleAddress, '60000000000000000000000', privateKeyAirdrop)    // 空投地址授权预售合约
    // await approve(A, exchangeAddress, '1200000000000000000000000', privateKeyPreSale) // 预售地址授权置换合约
    // console.log('-----------------------授权  结束-----------------------------')

    // console.log('-----------------------设置股东  开始-----------------------------')
    // await setShareAddress(owner, share1_, privateKeyOwner) // 设置股东1
    // await setShareAddress(owner, share2_, privateKeyOwner) // 设置股东2
    // await setShareAddress(owner, share3_, privateKeyOwner) // 设置股东3
    // await setShareAddress(owner, share4_, privateKeyOwner) // 设置股东4
    // console.log('-----------------------设置股东  结束-----------------------------')
}

call()