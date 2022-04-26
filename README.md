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


    0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      # 置换合约地址
    ```
- 5.给预售、空投等地址转账
    ```bash

    ```
- 6.预售地址和空投地址给PreSale合约授权approve, 预售地址给置换合约授权approve
    ```bash
    ```
- 7.添加和BNB的交易对后,调用PreSale的setPancakeswapOnline方法开启同步pancakeswap的价格
- 
