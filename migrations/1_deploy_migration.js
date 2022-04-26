const BYDK = artifacts.require("BYDK");
const PreSale = artifacts.require("PreSale");
const Exchange = artifacts.require("Exchange");

module.exports = async function (deployer) {
  // ERC20合约
  
  // const owner = ""  // 总地址
  const owner = ""     // 总地址

  // const A = ""      // 预售地址
  const A = ""      // 预售地址

  // const D = ""      // 空投地址
  const D = ""      // 空投地址

  const B = ""      // 技术地址
  const C = ""      // 风投地址
  const E = ""      // 社区地址
  const F = ""      // D池地址
  const G = ""      // 游戏地址
  const H = ""      // 基金地址
  const I = ""      // 竞拍地址
  await deployer.deploy(BYDK, H, I);
  const instanceBYDK = await BYDK.deployed();
  const erc20_ = instanceBYDK.address;
  //  ERC20旧合约
  // 

  // 预售合约
  // const collectionAddress_ = "" // 预售收益总地址
  const collectionAddress_ = "" // 预售收益总地址
  // const uniswapV2RouterAddress = ""
  const uniswapV2RouterAddress = ""
  await deployer.deploy(PreSale, erc20_, A, D, collectionAddress_, uniswapV2RouterAddress);
  //  预售合约旧地址
  // 

  // 置换合约
  // const oldAddress = ""
  const oldAddress = ""
  await deployer.deploy(Exchange, oldAddress, erc20_, owner)
  // 

  // 锁仓合约
  // const beneficiary_ = A   // 锁仓解锁收益地址
  // await deployer.deploy(TokenTimelock, erc20_, beneficiary_);
  // 

  // truffle run verify BYDK@ --network bsc
  // truffle run verify PreSale@ --network bsc
  // truffle run verify Exchange@ --network bsc
  // truffle run verify TokenTimeLock@ --network bsc
  
};
