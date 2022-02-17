var EthereumTx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const Common = require('ethereumjs-common').default;

// const bscChainId = 56 // 主网
const bscChainId = 97 // 测试网

// const rpc = 'https://bsc-dataseed.binance.org'
const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

// const pk = '' // 合约创建者私钥
const pk = '' // 合约创建者私钥

// const owner = '0xb3a7C64F9065c0a6A9EB57597943A3d187733238'     // 总地址
const owner = '0x1619a5a9Ddd5d47cd2e9D2D1f41Ad615924101fE'        // 总地址

// const A = '0x182AD90BFBFC9b972fE5298A0825314d5dDA3642'         // 预售地址
const A = '0x833439fDA8dAB6e2F56a41D24de862dd4f9eAcEA'            // 预售地址

// const D = '0x06aD629119493cCc0bc5423aeAd7e37cf31CEBAE'         // 空投地址
const D = '0x2ef414e68091F91Fc649877bb038a7Fa3c138592'            // 空投地址

const preSaleAddress = '' // 预售合约地址
const exchangeAddress = '' // 置换合约地址

const contractAddress = '0x1c4c2c9585343100f3a21b06dd03b7ED8D47D590' // BYDK合约地址


const contractABI = [{"inputs":[{"internalType":"address","name":"owner_","type":"address"},{"internalType":"address","name":"addrA_","type":"address"},{"internalType":"address","name":"addrB_","type":"address"},{"internalType":"address","name":"addrC_","type":"address"},{"internalType":"address","name":"addrD_","type":"address"},{"internalType":"address","name":"addrE_","type":"address"},{"internalType":"address","name":"addrF_","type":"address"},{"internalType":"address","name":"addrG_","type":"address"},{"internalType":"address","name":"addrH_","type":"address"},{"internalType":"address","name":"addrI_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"limit","type":"uint256"}],"name":"modifyShareLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]



const B = "0x8C2B33a09dA1Be414591204424f36b1F7dA14241"            // 技术地址
const C = "0x1ec9dcf7DCd28AFb87E96511BfF3494423d2B50A"            // 风投地址
const E = "0xf71BD23CF2322FF8ff2EB42Cda7b0157956b7449"            // 社区地址
const F = "0x3ce4b119488C10a62fE379a26cF99ba3bEd2E834"            // D池地址
const G = "0xc49E8851983c7aD445a1697bfF0Aacc85182C4CF"            // 游戏地址
const H = "0xD986Cfb4c7C370A6A81e24032d61836744D63647"            // 基金地址
const I = "0x144255298efF5AFd8000B9fba74e4a4F2aFD6b20"            // 竞拍地址
const zero = "0x0000000000000000000000000000000000000000"         // 零地址
const web3 = new Web3(rpc)
const privateKey = Buffer.from(pk, 'hex')


// 转账
async function transfer(to, amount) {
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const nonce = await web3.eth.getTransactionCount(owner, 'pending')
    const gasPrice = await web3.eth.getGasPrice()
    const data = contract.methods.transfer(to, amount).encodeABI()
    // 创建交易对象
    const txObject = {
        from: owner,
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
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        console.log('txHash:', txHash)
    })
}

// 排除分红地址
async function excludeFromReward(to) {
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const nonce = await web3.eth.getTransactionCount(owner, 'pending')
    const gasPrice = await web3.eth.getGasPrice()
    const data = contract.methods.excludeFromReward(to).encodeABI()
    // 创建交易对象
    const txObject = {
        from: owner,
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
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        console.log('txHash:', txHash)
    })
}

// 授权
async function approve(from, to, amount) {
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const nonce = await web3.eth.getTransactionCount(owner, 'pending')
    const gasPrice = await web3.eth.getGasPrice()
    const data = contract.methods.approve(from, to, amount).encodeABI()

    const txObject = {
        from: owner,
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
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        console.log('txHash:', txHash)
    })
}

excludeFromReward(owner) // 排除总地址
excludeFromReward(A) // 排除预售地址
excludeFromReward(B) // 排除技术地址
excludeFromReward(C) // 排除风投地址
excludeFromReward(D) // 排除空投地址
excludeFromReward(E) // 排除社区地址
excludeFromReward(F) // 排除D池地址
excludeFromReward(G) // 排除游戏地址
excludeFromReward(H) // 排除基金地址
excludeFromReward(I) // 排除竞拍地址
excludeFromReward(exchangeAddress) // 排除置换合约地址


transfer(A, '1200000000000000000000000') // 预售地址
transfer(B, '60000000000000000000000') // 技术地址
transfer(C, '40000000000000000000000') // 风投地址
transfer(D, '60000000000000000000000') // 空投地址
transfer(E, '40000000000000000000000') // 社区地址
transfer(F, '20000000000000000000000') // 排除D池地址
transfer(zero, '580000000000000000000000') // 游戏地址


approve(A, preSaleAddress, '1200000000000000000000000') // 预售地址授权预售合约
approve(D, preSaleAddress, '60000000000000000000000') // 空投地址授权预售合约