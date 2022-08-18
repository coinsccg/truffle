// SPDX-License-Identifier: MIT
// Creator: Chiru Labs

pragma solidity ^0.8.4;




contract Signature {
    
    struct Bid {
        uint256 amount;
        address owner;
    }

    bytes32 private  constant BID_TYPEHASH = keccak256("Bid(uint256 amount,address owner)");
    bytes32 private  constant EIP712_DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private DOMAIN_SEPARATOR;

    constructor() {
        DOMAIN_SEPARATOR = keccak256(abi.encode(
            EIP712_DOMAIN_TYPEHASH,
            keccak256("Auction dApp"),
            keccak256("2"),
            "97",
            address(this)
        ));
    }


    function hashBid(Bid memory bid) private view returns (bytes32){
        return keccak256(abi.encodePacked(
            "\\x19\\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                    BID_TYPEHASH,
                    bid.amount,
                    bid.owner
                )))
        );
    }

    function verify(address signer, Bid memory bid, uint8 v, bytes32 r, bytes32 s) public view returns (bool) {
        return signer == ecrecover(hashBid(bid), v, r, s);
    }
}
