pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender,address recipient,uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Exchange {

    IERC20 public oldA;
    IERC20 public newB;
    mapping (address => uint256) private user;
    address public owner;
    bool public isExchange;
    uint256 public rate;

    event Excahnge(address indexed sender, address indexed recipient, uint256 amount);

    constructor(IERC20 _A, IERC20 _B, address _owner){
        oldA = _A;
        newB = _B;
        owner = _owner;
        isExchange = true;
        rate = 100000;
    }

    function setExchange(bool _isExchange) external {
        require(msg.sender == owner, "Exchange: No permission");
        isExchange = _isExchange;
    }

    function exchange() external {
        require(isExchange, "Exchange: Close exchange");
        address spender = msg.sender;
        uint256 balanceOldA = oldA.balanceOf(spender);
        uint256 balanceNewB = newB.balanceOf(owner);
        uint256 excBalance = user[spender];
        uint256 exchangeAmount = (balanceOldA - excBalance)/rate;
        require(exchangeAmount > 0, "Exchange: Has been exchanged");
        require(balanceNewB >= balanceOldA, "Exchange: The balance is insufficient and cannot be exchanged");
        newB.transferFrom(owner, spender, exchangeAmount);
        user[spender] = balanceOldA;
        emit Excahnge(owner, spender, exchangeAmount);
    }

}


