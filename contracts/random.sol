pragma solidity 0.8.0;


contract Random {
  
  uint256 private nonce = 1;
  
  function getRandom(uint256 start, uint256 end) public returns(uint256){
      if (start == end) {
        return start;
      }
      uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, nonce)));
      nonce++;
      return start + random % (end - start);
  }

}
