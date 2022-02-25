const BYDK = artifacts.require("BYDK");
const PreSale = artifacts.require("PreSale");
const Exchange = artifacts.require("Exchange");

module.exports = async function (deployer) {
  // ERC20合约
  
  // const owner = "0xb3a7C64F9065c0a6A9EB57597943A3d187733238"  // 总地址
  const owner = "0x5e757A0DEc95Bf3a9699cf4cA7147a1F92Ce82a9"     // 总地址

  // const A = "0x182AD90BFBFC9b972fE5298A0825314d5dDA3642"      // 预售地址
  const A = "0xEEA13450C12335B28B1162ef56B80aaC9AFd0C10"      // 预售地址

  // const D = "0x06aD629119493cCc0bc5423aeAd7e37cf31CEBAE"      // 空投地址
  const D = "0x5AFbA347450A2299c1A2b827eafEf3835BB85668"      // 空投地址

  const B = "0x8C2B33a09dA1Be414591204424f36b1F7dA14241"      // 技术地址
  const C = "0x1ec9dcf7DCd28AFb87E96511BfF3494423d2B50A"      // 风投地址
  const E = "0xf71BD23CF2322FF8ff2EB42Cda7b0157956b7449"      // 社区地址
  const F = "0x3ce4b119488C10a62fE379a26cF99ba3bEd2E834"      // D池地址
  const G = "0xc49E8851983c7aD445a1697bfF0Aacc85182C4CF"      // 游戏地址
  const H = "0xD986Cfb4c7C370A6A81e24032d61836744D63647"      // 基金地址
  const I = "0x144255298efF5AFd8000B9fba74e4a4F2aFD6b20"      // 竞拍地址
  await deployer.deploy(BYDK, H, I);
  const instanceBYDK = await BYDK.deployed();
  const erc20_ = instanceBYDK.address;
  // 0xE3518Afd0a45439c737823c3EDcb85611FcEbB3b ERC20旧合约
  // 0xc4a64752Ff2e476fbAB56e09e1592d0B68f73C73

  // 预售合约
  // const collectionAddress_ = "0x44a5e594146706Cf5d93Fa3d4B6D6d0fFC01b82d" // 预售收益总地址
  const collectionAddress_ = "0x5e757A0DEc95Bf3a9699cf4cA7147a1F92Ce82a9" // 预售收益总地址
  // const uniswapV2RouterAddress = "0x10ed43c718714eb63d5aa57b78b54704e256024e"
  const uniswapV2RouterAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3"
  await deployer.deploy(PreSale, erc20_, A, D, collectionAddress_, uniswapV2RouterAddress);
  // 0xA6a8f5eEad44CDaDed5516184bF1427997bc7ec3 预售合约旧地址
  // 0x021874f17efeCBB9b8CCdEAd93A5C4E3d99B9afD

  // 置换合约
  // const oldAddress = "0xE3518Afd0a45439c737823c3EDcb85611FcEbB3b"
  const oldAddress = "0x1c4c2c9585343100f3a21b06dd03b7ed8d47d590"
  await deployer.deploy(Exchange, oldAddress, erc20_, owner)
  // 0x09a1ee116899B905263400964C8C9be139febF2e

  // 锁仓合约
  // const beneficiary_ = A   // 锁仓解锁收益地址
  // await deployer.deploy(TokenTimelock, erc20_, beneficiary_);
  // 0x6C116406FcD525BAC21dd52954C1eDa4aa9368B2

  // truffle run verify BYDK@0xc4a64752Ff2e476fbAB56e09e1592d0B68f73C73 --network bsc
  // truffle run verify PreSale@0x021874f17efeCBB9b8CCdEAd93A5C4E3d99B9afD --network bsc
  // truffle run verify Exchange@0x09a1ee116899B905263400964C8C9be139febF2e --network bsc
  // truffle run verify TokenTimeLock@0x6C116406FcD525BAC21dd52954C1eDa4aa9368B2 --network bsc
  
};