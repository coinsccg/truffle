const BYDK = artifacts.require("BYDK");
const PreSale = artifacts.require("PreSale");
const Exchange = artifacts.require("Exchange");

module.exports = async function (deployer) {
  // ERC20合约
  // const owner = "0xb3a7C64F9065c0a6A9EB57597943A3d187733238"  // 总地址
  const owner = "0x1619a5a9Ddd5d47cd2e9D2D1f41Ad615924101fE"     // 总地址
  // const A = "0x182AD90BFBFC9b972fE5298A0825314d5dDA3642"      // 预售地址
  const A = "0x833439fDA8dAB6e2F56a41D24de862dd4f9eAcEA"      // 预售地址
  const B = "0x8C2B33a09dA1Be414591204424f36b1F7dA14241"      // 技术地址
  const C = "0x1ec9dcf7DCd28AFb87E96511BfF3494423d2B50A"      // 风投地址
  // const D = "0x06aD629119493cCc0bc5423aeAd7e37cf31CEBAE"      // 空投地址
  const D = "0x2ef414e68091F91Fc649877bb038a7Fa3c138592"      // 空投地址
  const E = "0xf71BD23CF2322FF8ff2EB42Cda7b0157956b7449"      // 社区地址
  const F = "0x3ce4b119488C10a62fE379a26cF99ba3bEd2E834"      // D池地址
  const G = "0xc49E8851983c7aD445a1697bfF0Aacc85182C4CF"      // 游戏地址
  const H = "0xD986Cfb4c7C370A6A81e24032d61836744D63647"      // 基金地址
  const I = "0x144255298efF5AFd8000B9fba74e4a4F2aFD6b20"      // 竞拍地址
  await deployer.deploy(BYDK, H, I);
  const instanceBYDK = await BYDK.deployed();
  const erc20_ = instanceBYDK.address;
  // 0xE3518Afd0a45439c737823c3EDcb85611FcEbB3b
  // 0x9f22475dbbaa98e65a2C82B4dF2abc665A45986A


  // 预售合约
  const preSaleAddress_ = A                                               // 预售地址
  const airdropAddress_ = D                                               // 空投地址
  // const collectionAddress_ = "0x44a5e594146706Cf5d93Fa3d4B6D6d0fFC01b82d" // 预售收益总地址
  const collectionAddress_ = "0x1619a5a9Ddd5d47cd2e9D2D1f41Ad615924101fE" // 预售收益总地址
  const share1_ = "0xB4a4a4f7eB75994855Bb99A61EBDCEcF499FeFbD"            // 股东1
  const share2_ = "0x69B1f31ae550BEf5F254bbF95173520fbb945Aa5"            // 股东2
  const share3_ = "0x1Bc29671F73A42c515C969f19Ca8056A27f848c1"            // 股东3
  const share4_ = "0x1759862A95a03D322EED0C9357A64C21C509b588"            // 股东4
  await deployer.deploy(PreSale, erc20_, preSaleAddress_, collectionAddress_, airdropAddress_, share1_, share2_, share3_, share4_);
  // 0xA6a8f5eEad44CDaDed5516184bF1427997bc7ec3 预售合约旧地址
  // 0x222386C29Cd2b763039D9198878147Bf59F981F6

  // 置换合约
  // const oldAddress = "0xE3518Afd0a45439c737823c3EDcb85611FcEbB3b"
  const oldAddress = "0x1c4c2c9585343100f3a21b06dd03b7ed8d47d590"
  await deployer.deploy(Exchange, oldAddress, erc20_, owner)
  // 0xF2d750CEF41Df1349691915BD7E892A0BFc189B5


  // 锁仓合约
  // const beneficiary_ = A   // 锁仓解锁收益地址
  // await deployer.deploy(TokenTimelock, erc20_, beneficiary_);
  // // 0x6C116406FcD525BAC21dd52954C1eDa4aa9368B2

  // 预售 12000
  // 空投 600
  // 技术 600
  // 风投 400
  // D池  200
  // 社区 400
  // 游戏生态 5800


  // truffle run verify BYDK@0xE3518Afd0a45439c737823c3EDcb85611FcEbB3b --network bsc
  // truffle run verify PreSale@0xA6a8f5eEad44CDaDed5516184bF1427997bc7ec3 --network bsc
  // truffle run verify Exchange@0x6C116406FcD525BAC21dd52954C1eDa4aa9368B2 --network bsc
  // truffle run verify TokenTimeLock@0x6C116406FcD525BAC21dd52954C1eDa4aa9368B2 --network bsc
  
};