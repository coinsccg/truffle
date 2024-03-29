
var contractAddress = "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070";
var owenr = "0x3333333333333333333333333333333333333333";
var amount = 100;

const data = JSON.stringify({
    types: {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
        ],
        Bid: [
            { name: "numerator", type: "uint256" },
            { name: "owner", type: "address" },
        ],
    },
    domain: {
        name: "Auction dApp",
        version: "2",
        chainId: parseInt(web3.version.network, 10),
        verifyingContract: contractAddress,
    },
    primaryType: "Bid",
    message: {
        numerator: amount,
        owner: owenr
    }
});
let signer = xxx;
window.web3.currentProvider.request({
            method: "eth_signTypedData_v4",
            params: [signer, data],
        }).then(res => {
            const signature = res.substring(2);
            const r = "0x" + signature.substring(0, 64);
            const s = "0x" + signature.substring(64, 128);
            const v = parseInt(signature.substring(128, 130), 16);
            console.log(r);
            console.log(s);
            console.log(v)
        })
