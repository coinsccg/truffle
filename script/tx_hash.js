var EthereumTx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const Common = require('ethereumjs-common').default;
const bscChainId = 4 // 测试网
const rpc = 'https://rinkeby.infura.io/v3/457c1ac43c544b05abfef0163084a7a6'

const abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"candidate","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"nameArg","type":"string"},{"internalType":"string","name":"symbolArg","type":"string"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"updateOwner","outputs":[],"stateMutability":"nonpayable","type":"function"}]
async function call() {
    //转账金额
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
    const from = "0x7cD1CB03FAE64CBab525C3263DBeB821Afd64483"
    const value = 1 * Math.pow(10,18)
    const gasPrice = await web3.eth.getGasPrice()
    console.log(gasPrice)
    const nonce = await web3.eth.getTransactionCount(from)
    console.log(nonce)
    
    const contract = new web3.eth.Contract(abi, "0x5689C8c064aA6D3e05c2BB94219d09C49c53eAA2")
    const data = contract.methods.transfer("0xd3dE9c47b917baAd93F68B2c0D6dEe857D20b015", "1000000000000000").encodeABI()
    
    //封装一个交易
    const rawTx = {
        nonce: nonce,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(800003),
        to: "0x5689C8c064aA6D3e05c2BB94219d09C49c53eAA2",
        // value: web3.utils.toHex(value),
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
    //签名交易
    const pk = "664595eacc7d1dceb5e4038b5bae26fca4d63ab4d6a428ee7bdbf610e5f0dff2"
    const privateKey = Buffer.from(pk, 'hex')
    var tx = new EthereumTx(rawTx, {'common': BSC});
    tx.sign(privateKey);
    //得到签名后的raw数据
    var raw = tx.serialize(); 
    hash = web3.utils.sha3(raw);
    console.log(hash)

    // 广播交易
    // await web3.eth.sendSignedTransaction('0x' + raw.toString('hex'), (err, txHash) => {
    //     console.log('txHash:', txHash, 'err:', err)
    // })
}

call()
