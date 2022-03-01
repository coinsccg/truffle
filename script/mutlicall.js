const Web3 = require('web3')
const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
const web3 = new Web3(rpc)
const multicallContractAddress = "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C"
const contractABI = [{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall.Call[]","name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bytes[]","name":"returnData","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getBlockHash","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentBlockCoinbase","outputs":[{"internalType":"address","name":"coinbase","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentBlockDifficulty","outputs":[{"internalType":"uint256","name":"difficulty","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentBlockGasLimit","outputs":[{"internalType":"uint256","name":"gaslimit","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentBlockTimestamp","outputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getEthBalance","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLastBlockHash","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"}]
async function multicall() {
    //转账金额
    const targetContractAddress = "0x1C298696b90f535E8c82ae2aE81191eb49F7b8C5"
    const dataBytes = web3.eth.abi.encodeFunctionCall({
        name: 'balanceOf',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'account'
        }]
    }, ['0xb0fd4236f7d5236a6d7b5097c671a5ea10402d6e']);
    const obj = [{
        target: targetContractAddress,
        callData: web3.utils.hexToBytes(dataBytes)
    }]
    const contract = new web3.eth.Contract(contractABI, multicallContractAddress)
    const resp = await contract.methods.aggregate(obj).call()
    console.log(web3.utils.hexToNumberString(resp.returnData[0]))
}
multicall()
