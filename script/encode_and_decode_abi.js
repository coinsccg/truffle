var Web3 = require('web3');

var web3 = new Web3();

var abi = web3.eth.abi.encodeFunctionCall({
    name: 'myMethod',
    type: 'function',
    inputs: [{
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'string',
        name: 'myString'
    }]
}, ['2345675643', 'Hello!%']);
console.log(abi)



var abiHex = "0x24ee0097000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000"

var param = web3.eth.abi.decodeParameters([
    {
        type: 'uint256',
        name: 'myNumber'
    },{
        type: 'string',
        name: 'myString'
    }
  ], "0x" + abiHex.slice(10))
  console.log(param)
