var EthereumTx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const Common = require('ethereumjs-common').default;
const bscChainId = 97 // 测试网
const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
const web3 = new Web3(rpc)
async function call() {
    //转账金额
    const from = "0x5e757A0DEc95Bf3a9699cf4cA7147a1F92Ce82a9"
    const value = 1 * Math.pow(10,18)
    const nonce = await web3.eth.getTransactionCount(from, 'pending')
    const gasPrice = await web3.eth.getGasPrice()

    //封装一个交易
    const rawTx = {
        nonce: nonce,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(800000),
        to: "0x5AFbA347450A2299c1A2b827eafEf3835BB85668",
        value: web3.utils.toHex(value),
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
    const pk = ""
    const privateKey = Buffer.from(pk, 'hex')
    var tx = new EthereumTx(rawTx, {'common': BSC});
    tx.sign(privateKey);
    //得到签名后的raw数据
    var raw = tx.serialize().toString('hex'); 
    console.log(raw)
    // 广播交易
    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
        console.log('txHash:', txHash, 'err:', err)
    })
}

call()
