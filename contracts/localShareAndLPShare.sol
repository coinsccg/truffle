// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


contract Ownable is Context {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        address msgSender = _msgSender();
        owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    modifier onlyOwner() {
        require(owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(owner, address(0));
        owner = address(0);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

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


interface IUniswapV2Factory {function createPair(address tokenA, address tokenB) external returns (address pair);}

interface IUniswapV2Pair {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
}

interface IUniswapV2Router02 is IUniswapV2Router01 {}


contract ERC20Token is Ownable, IERC20 {
    mapping(address => mapping(address => uint256)) private _allowances;

    uint8 private _decimal = 18;

    // 修改此处代币名称及符号
    string private _name = "BYBY TOKEN";
    string private _symbol = "BB";

    uint256 private constant MAX = ~uint256(0);
    uint256 private _tTotal;
    uint256 private _rTotal;
    uint256 private _tFeeTotal;

    uint256 public _burnMinLimit;
    uint256 public _maxTxAmount;

    uint256 public _tLocalRate;
    uint256 public _tBlackRate;
    uint256 public _tLPRate;

    uint256 public _sLocalRate;
    uint256 public _sBlackRate;
    uint256 public _sLPRate;

    uint256 private _tLocalPreRate;
    uint256 private _tBlackPreRate;
    uint256 private _tLPPreRate;

    uint256 private _sLocalPreRate;
    uint256 private _sBlackPreRate;
    uint256 private _sLPPreRate;

    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    mapping (address => bool) private _isExcluded;

    IERC20 public uniswapV2Pair;

    address[] private _excluded;


    struct TaxFeeT {
        uint256 tlocalFee;
        uint256 tblackFee;
        uint256 tlPFee;
    }

    struct TaxFeeR {
        uint256 rlocalFee;
        uint256 rblackFee;
        uint256 rlPFee;
    }
    
    constructor() {
        owner = msg.sender;

        _tTotal = 95557_0000_0000_0000 * 10**_decimal;
        _rTotal = (MAX - (MAX % _tTotal));

        _rOwned[owner] = _rTotal;

        _burnMinLimit = 100_0000_0000 * 10**_decimal;
        _maxTxAmount = 1000_0000_0000 * 10**_decimal;

        _tLocalRate = 2;
        _tBlackRate = 1;
        _tLPRate = 2;

        _sLocalRate = 2;
        _sBlackRate = 3;
        _sLPRate = 3;

        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0xED7d5F38C79115ca12fe6C0041abb22F0A06C300);
        uniswapV2Pair = IERC20(IUniswapV2Factory(_uniswapV2Router.factory()).createPair(0xa71EdC38d189767582C38A3145b5873052c3e47a, address(this)));
        
        // 交易对、owenr、零地址排除持币分红
        excludeFromReward(address(0));
        excludeFromReward(address(this));
        excludeFromReward(address(owner));
        excludeFromReward(address(uniswapV2Pair));

        excludeLpProvider[address(0)] = true;

        emit Transfer(address(0), owner, _tTotal);
    }


    function name() public view virtual  returns (string memory) {
        return _name;
    }

    function symbol() public view virtual  returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual  returns (uint8) {
        return _decimal;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _tTotal;
    }

    function totalSupplyReflection() public view virtual returns (uint256) {
        return _rTotal;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        if (_isExcluded[account]) return _tOwned[account];
        return tokenFromReflection(_rOwned[account]);
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(_msgSender(), spender, currentAllowance - subtractedValue);
        }
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function isExcludedFromReward(address account) public view returns (bool) {
        return _isExcluded[account];
    }

    function totalFees() public view returns (uint256) {
        return _tFeeTotal;
    }

    function setBurnMinLimit(uint256 minLimit) external onlyOwner {
        _burnMinLimit = minLimit * 10**_decimal;
    }

    function setMaxTxAmount(uint256 maxTxAmount) public onlyOwner {
        _maxTxAmount = maxTxAmount * 10**_decimal;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        if(sender != owner && recipient != owner) 
            require(amount <= _maxTxAmount, "Transfer amount exceeds the maxTxAmount.");

        if (sender == address(uniswapV2Pair) || recipient == address(uniswapV2Pair)){
            _tokenTransfer(sender, recipient, amount, 2);

            if (sender == address(uniswapV2Pair)){
                addLpProvider(recipient);
            } else {
                addLpProvider(sender);
            }
            
        } else {
            _tokenTransfer(sender, recipient, amount, 1);
        }

        // LP分红
        if (sender != address(this)) {
            executeLpShare(500000);
        }
    }

    function excludeFromReward(address account) public onlyOwner {
        require(!_isExcluded[account], "Account is already excluded");
        if(_rOwned[account] > 0) {
            _tOwned[account] = tokenFromReflection(_rOwned[account]);
        }
        _isExcluded[account] = true;
        _excluded.push(account);
    }

    function includeInReward(address account) external onlyOwner {
        require(_isExcluded[account], "Account is already excluded");
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_excluded[i] == account) {
                _excluded[i] = _excluded[_excluded.length - 1];
                _tOwned[account] = 0;
                _isExcluded[account] = false;
                _excluded.pop();
                break;
            }
        }
    }

    function setTaxFeePercent(
        uint256 tLocalRate_, 
        uint256 tBlackRate_, 
        uint256 tLPRate_, 
        uint256 sLocalRate_, 
        uint256 sBlackRate_, 
        uint256 sLPRate_) external onlyOwner {
        _tLocalRate = tLocalRate_;
        _tBlackRate = tBlackRate_;
        _tLPRate = tLPRate_;
        _sLocalRate = sLocalRate_;
        _sBlackRate = sBlackRate_;
        _sLPRate = sLPRate_;
    }
    
    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Amount must be less than total reflections");
        uint256 currentRate =  _getRate();
        return rAmount / currentRate;
    }

    function calculateTaxFee(uint256 amount, uint256 option) private view returns (TaxFeeT memory taxFeeT) {
        if ((_tTotal - _tOwned[address(0)]) >= _burnMinLimit){
            if (option == 1){
                taxFeeT.tlocalFee = amount * _tLocalRate / 100;
                taxFeeT.tlPFee = amount * _tLPRate / 100;
                taxFeeT.tblackFee = amount * _tBlackRate / 100;
            } else {
                taxFeeT.tlocalFee = amount * _sLocalRate / 100;
                taxFeeT.tlPFee = amount * _sLPRate / 100;
                taxFeeT.tblackFee = amount * _sBlackRate / 100;
            }
        }
    }

    function calculateTaxFeeReflection(uint256 _amount, uint256 currentRate, uint256 option) private view returns (TaxFeeR memory taxFeeR, TaxFeeT memory taxFeeT) {
        taxFeeT = calculateTaxFee(_amount, option);
        if (taxFeeT.tlocalFee > 0){
            taxFeeR.rlocalFee = taxFeeT.tlocalFee * currentRate;
            taxFeeR.rlPFee = taxFeeT.tblackFee * currentRate;
            taxFeeR.rblackFee = taxFeeT.tlPFee * currentRate;
        }   
    }

    function _getRate() private view returns(uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply / tSupply;
    }

    function _getCurrentSupply() private view returns(uint256, uint256) {
        uint256 rSupply = _rTotal;
        uint256 tSupply = _tTotal;
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_rOwned[_excluded[i]] > rSupply || _tOwned[_excluded[i]] > tSupply) return (_rTotal, _tTotal);
            rSupply = rSupply-_rOwned[_excluded[i]];
            tSupply = tSupply-_tOwned[_excluded[i]];
        }
        if (rSupply < _rTotal / _tTotal) return (_rTotal, _tTotal); // rTotal - m * (rTotal/tTotal) >= rTotal/tTotal ==> m <= tTotal
        return (rSupply, tSupply);
    }

    function _tokenTransfer(address sender, address recipient, uint256 amount, uint256 option) private {
        if (_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferFromExcluded(sender, recipient, amount, option);
        } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
            _transferToExcluded(sender, recipient, amount, option);
        } else if (_isExcluded[sender] && _isExcluded[recipient]) {
            _transferBothExcluded(sender, recipient, amount, option);
        } else {
            _transferStandard(sender, recipient, amount, option);
        }
    }

    function _reflectFee(uint256 rShareFree, uint256 tShareFree) private {
        if (rShareFree > 0){
            _rTotal = _rTotal-rShareFree;
            _tFeeTotal = _tFeeTotal+tShareFree;
        }
    }

    function _getRValues(uint256 tAmount, uint256 currentRate, uint256 option) private view returns (uint256, uint256, uint256, TaxFeeR memory, TaxFeeT memory) {
        uint256 rAmount = tAmount*currentRate;
        (TaxFeeR memory taxFeeR, TaxFeeT memory taxFeeT) = calculateTaxFeeReflection(tAmount, currentRate, option);

        uint256 tTransferAmount = tAmount- taxFeeT.tlocalFee - taxFeeT.tblackFee - taxFeeT.tlPFee;

        uint256 rTransferAmount = rAmount - taxFeeR.rlocalFee - taxFeeR.rblackFee - taxFeeR.rlPFee;

        return (tTransferAmount, rAmount, rTransferAmount, taxFeeR, taxFeeT);
    }

    function _transferStandard(address sender, address recipient, uint256 tAmount, uint256 option) private {
        (uint256 tTransferAmount, uint256 rAmount, uint256 rTransferAmount, TaxFeeR memory taxFeeR, TaxFeeT memory taxFeeT) = _getRValues(tAmount, _getRate(), option);

        _rOwned[sender] = _rOwned[sender] - rAmount;
        _rOwned[recipient] = _rOwned[recipient] + rTransferAmount;

        _relationShare(sender, taxFeeT, taxFeeR);
        
        if (taxFeeR.rlocalFee > 0){
            _reflectFee(taxFeeR.rlocalFee, taxFeeT.tlocalFee);
        }
        emit Transfer(sender, recipient, tTransferAmount);
    }
    
    // 接收者被排除
    function _transferToExcluded(address sender, address recipient, uint256 tAmount, uint256 option) private {
        (uint256 tTransferAmount, uint256 rAmount, uint256 rTransferAmount, TaxFeeR memory taxFeeR, TaxFeeT memory taxFeeT) = _getRValues(tAmount, _getRate(), option);
        
        _rOwned[sender] = _rOwned[sender]-rAmount;
        _tOwned[recipient] = _tOwned[recipient]+tTransferAmount;
        _rOwned[recipient] = _rOwned[recipient]+rTransferAmount;

        _relationShare(sender, taxFeeT, taxFeeR);

        if (taxFeeR.rlocalFee > 0){
            _reflectFee(taxFeeR.rlocalFee, taxFeeT.tlocalFee);
        }
        
        emit Transfer(sender, recipient, tTransferAmount);
    }

    // 发送者被排除
    function _transferFromExcluded(address sender, address recipient, uint256 tAmount, uint256 option) private {
        (uint256 tTransferAmount, uint256 rAmount, uint256 rTransferAmount, TaxFeeR memory taxFeeR, TaxFeeT memory taxFeeT) = _getRValues(tAmount, _getRate(), option);

        _tOwned[sender] = _tOwned[sender]-tAmount;
        _rOwned[sender] = _rOwned[sender]-rAmount;
        _rOwned[recipient] = _rOwned[recipient]+rTransferAmount;
        
        _relationShare(sender, taxFeeT, taxFeeR);

        if (taxFeeR.rlocalFee > 0){
            _reflectFee(taxFeeR.rlocalFee, taxFeeT.tlocalFee);
        }
        emit Transfer(sender, recipient, tTransferAmount);
    }

    // 两者都被排除
    function _transferBothExcluded(address sender, address recipient, uint256 tAmount, uint256 option) private {
        (uint256 tTransferAmount, uint256 rAmount, uint256 rTransferAmount, TaxFeeR memory taxFeeR, TaxFeeT memory taxFeeT) = _getRValues(tAmount, _getRate(), option);
        
        _tOwned[sender] = _tOwned[sender] - tAmount;
        _rOwned[sender] = _rOwned[sender] - rAmount;
        _tOwned[recipient] = _tOwned[recipient] + tTransferAmount;
        _rOwned[recipient] = _rOwned[recipient] + rTransferAmount;
        
        _relationShare(sender, taxFeeT, taxFeeR);

        if (taxFeeR.rlocalFee > 0){
            _reflectFee(taxFeeR.rlocalFee, taxFeeT.tlocalFee);
        }
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _relationShare(address sender, TaxFeeT memory taxFeeT, TaxFeeR memory taxFeeR) private {
        if (taxFeeT.tlPFee > 0){
            _tOwned[address(this)] = _tOwned[address(this)] + taxFeeT.tlPFee;
            _rOwned[address(this)] = _rOwned[address(this)] + taxFeeR.rlPFee;
            _tOwned[address(0)] = _tOwned[address(0)] + taxFeeT.tblackFee;
            _rOwned[address(0)] = _rOwned[address(0)] + taxFeeR.rblackFee;
            emit Transfer(sender, address(this), taxFeeT.tlPFee);
            emit Transfer(sender, address(0), taxFeeT.tblackFee);
        }
    }

    address[] private lpProviders;
    mapping(address => uint256) lpProviderIndex;
    mapping(address => bool) excludeLpProvider;

    //加入LP持有列表，发生交易就加入
    function addLpProvider(address adr) private {
        if (lpProviderIndex[adr] == 0) {
            lpProviderIndex[adr] = lpProviders.length;
            lpProviders.push(adr);
        }
    }

    uint256 private currentIndex;
    uint256 private lpRewardCondition = 10;
    uint256 private lastBlockNum;

    //执行LP分红
    function executeLpShare(uint256 gas) private {
        if (lastBlockNum + 200 > block.number) {
            return;
        }
        uint totalPair = uniswapV2Pair.totalSupply();
        if (totalPair == 0) {
            return;
        }

        uint256 balance = balanceOf(address(this));
        if (balance < lpRewardCondition) {
            return;
        }

        address shareHolder;
        uint256 pairBalance;
        uint256 amount;

        uint256 shareholderCount = lpProviders.length;

        uint256 gasUsed = 0;
        uint256 iterations = 0;

        uint256 gasLeft = gasleft();

        //最多只给列表完整分配一次，iterations < shareholderCount
        while (gasUsed < gas && iterations < shareholderCount) {
            //下标比列表长度大，从头开始
            if (currentIndex >= shareholderCount) {
                currentIndex = 0;
            }
            shareHolder = lpProviders[currentIndex];
            //持有的 LP 代币余额，LP 本身也是一种代币
            pairBalance = uniswapV2Pair.balanceOf(shareHolder);
            //不在排除列表，才分红
            if (pairBalance > 0 && !excludeLpProvider[shareHolder]) {
                amount = balance * pairBalance / totalPair;
                if (amount > 0) {
                    _tokenTransfer(address(this), shareHolder, amount, 1);
                }
            }

            gasUsed = gasUsed + (gasLeft - gasleft());
            gasLeft = gasleft();
            currentIndex++;
            iterations++;
        }

        lastBlockNum = block.number;
    }

    //是否排除LP分红
    function setExcludeLPProvider(address addr, bool enable) external onlyOwner {
        excludeLpProvider[addr] = enable;
    }
}
