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

// const owner = ''     // 总地址
const owner = ''        // 总地址

// const A = ''         // 预售地址
const A = ''            // 预售地址

// const D = ''         // 空投地址
const D = ''            // 空投地址


const contractAddress = '' // BYDK合约地址
const preSaleAddress = ''  // 预售合约地址
const exchangeAddress = '' // 置换合约地址



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

const B = ""            // 技术地址
const C = ""            // 风投地址
const E = ""            // 社区地址
const F = ""            // D池地址
const G = ""            // 游戏地址
const H = ""            // 基金地址
const I = ""            // 竞拍地址
const zero = "0x0000000000000000000000000000000000000000"         // 零地址
const share1_ = ""            // 股东1
const share2_ = ""            // 股东2
const share3_ = ""            // 股东3
const share4_ = ""            // 股东4
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
    await excludeFromReward(owner, owner, privateKeyOwner)              
    await excludeFromReward(owner, A, privateKeyOwner)                  
    await excludeFromReward(owner, B, privateKeyOwner)                  
    await excludeFromReward(owner, C, privateKeyOwner)                  
    await excludeFromReward(owner, D, privateKeyOwner)                  
    await excludeFromReward(owner, E, privateKeyOwner)                  
    await excludeFromReward(owner, F, privateKeyOwner)                 
    await excludeFromReward(owner, G, privateKeyOwner)                  
    await excludeFromReward(owner, H, privateKeyOwner)                  
    await excludeFromReward(owner, I, privateKeyOwner)                
    await excludeFromReward(owner, exchangeAddress, privateKeyOwner)   
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
