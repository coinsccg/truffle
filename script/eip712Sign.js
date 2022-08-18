
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
            { name: "salt", type: "bytes32" },
        ],
        Bid: [
            { name: "amount", type: "uint256" },
            { name: "wallet", type: "address" },
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
        amount: amount,
        wallet: owenr
    }
});

web3.currentProvider.sendAsync(
    {
        method: "eth_signTypedData_v4",
        params: [signer, data],
        from: signer
    },
    function(err, result) {
        if (err) {
            return console.error(err);
        }
        const signature = result.result.substring(2);
        const r = "0x" + signature.substring(0, 64);
        const s = "0x" + signature.substring(64, 128);
        const v = parseInt(signature.substring(128, 130), 16);
        // The signature is now comprised of r, s, and v.
        }
    );
