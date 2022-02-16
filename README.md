### 部署流程
- 1.编译合约
    ```bash
    truffle compile
    ```
- 2.迁移合约
    ```bash
    truffle migrate --network bsc
    ```
- 3.验证合约
    ```
    truffle run verify BYDK@address --network bsc
    truffle run verify PreSale@address --network bsc
    truffle run verify Exchange@address --network bsc
    ```
- 4.调用excludeFromReward方法设置免手续费名单
    ```bash
    0xb3a7C64F9065c0a6A9EB57597943A3d187733238      # 总地址
    0x182AD90BFBFC9b972fE5298A0825314d5dDA3642      # 预售地址
    0x8C2B33a09dA1Be414591204424f36b1F7dA14241      # 技术地址
    0x1ec9dcf7DCd28AFb87E96511BfF3494423d2B50A      # 风投地址
    0x06aD629119493cCc0bc5423aeAd7e37cf31CEBAE      # 空投地址
    0xf71BD23CF2322FF8ff2EB42Cda7b0157956b7449      # 社区地址
    0x3ce4b119488C10a62fE379a26cF99ba3bEd2E834      # D池地址
    0xc49E8851983c7aD445a1697bfF0Aacc85182C4CF      # 游戏地址
    0xD986Cfb4c7C370A6A81e24032d61836744D63647      # 基金地址
    0x144255298efF5AFd8000B9fba74e4a4F2aFD6b20      # 竞拍地址

    0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      # 置换合约地址
    ```
- 5.给预售、空投等地址转账
    ```bash
    0x182AD90BFBFC9b972fE5298A0825314d5dDA3642 12000 # 预售
    0x06aD629119493cCc0bc5423aeAd7e37cf31CEBAE 600   # 空投 
    0x8C2B33a09dA1Be414591204424f36b1F7dA14241 600   # 技术 
    0x1ec9dcf7DCd28AFb87E96511BfF3494423d2B50A 400   # 风投
    0x3ce4b119488C10a62fE379a26cF99ba3bEd2E834 200   # D池
    0xf71BD23CF2322FF8ff2EB42Cda7b0157956b7449 400   # 社区
    0x0000000000000000000000000000000000000000 5800  # 游戏生态 进黑洞
    ```
- 6.预售地址和空投地址给PreSale合约授权approve, 预售地址给置换合约授权approve
    ```bash
    0x182AD90BFBFC9b972fE5298A0825314d5dDA3642 12000000000000000000000 # 预售
    0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 12000000000000000000000 # 置换合约
    0x06aD629119493cCc0bc5423aeAd7e37cf31CEBAE 600000000000000000000   # 空投
    ```
- 7.添加和BNB的交易对后,调用PreSale的setPancakeswapOnline方法开启同步pancakeswap的价格
- 