var web3 = require('web3');

var w3 = new web3();

var funcName = "myMethod";
var inputType = [{
    type: 'uint256',
    name: 'myNumber'
},{
    type: 'string',
    name: 'myString'
}];
var inputParam = ['2345675643', 'Hello!%'];
var funcCallInputBytes = w3.eth.abi.encodeFunctionCall({
    name: funcName,
    type: 'function',
    inputs: inputType
}, inputParam);
console.log(funcCallInputBytes)

// var funcCallInputBytes = "0x24ee0097000000000000000000000000000000000000000000000000000000008bd02b7b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000"

var param = w3.eth.abi.decodeParameters(inputType, "0x" + funcCallInputBytes.slice(10))
console.log(param["myNumber"], param["myString"])
