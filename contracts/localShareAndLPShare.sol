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


    struct TaxFee {
        uint256 tLocalRate;
        uint256 tBlackRate;
        uint256 tLPRate;
        uint256 sLocalRate;
        uint256 sBlackRate;
        uint256 sLPRate;
    }

    struct TaxFeeReflection {
        uint256 rtLocalRate;
        uint256 rtBlackRate;
        uint256 rtLPRate;
        uint256 rsLocalRate;
        uint256 rsBlackRate;
        uint256 rsLPRate;
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
            processLP(500000);
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

    function calculateTaxFee(uint256 _amount, uint256 ty) private view returns (TaxFee memory taxFee) {
        if ((_tTotal - _tOwned[address(0)]) >= _burnMinLimit){
            if (ty == 1){
                taxFee.tLocalRate = _amount * _tLocalRate / 100;
                taxFee.tLPRate = _amount * _tLPRate / 100;
                taxFee.tBlackRate = _amount*_tBlackRate/100;
            } else {
                taxFee.sLocalRate = _amount*_sLocalRate/100;
                taxFee.sLPRate = _amount*_sLPRate/100;
                taxFee.sBlackRate = _amount*_sBlackRate/100;
            }
        }
    }

    function calculateTaxFeeReflection(uint256 _amount, uint256 currentRate, uint256 ty) private view returns (TaxFeeReflection memory feeRelection, TaxFee memory taxFee) {
        taxFee = calculateTaxFee(_amount, ty);
        if (taxFee.tLocalRate > 0 || taxFee.sLocalRate > 0){
            if (ty == 1){
                feeRelection.rtLocalRate = taxFee.tLocalRate*currentRate;
                feeRelection.rtBlackRate = taxFee.tBlackRate*currentRate;
                feeRelection.rtLPRate = taxFee.tLPRate*currentRate;
            } else {
                feeRelection.rsLocalRate = taxFee.sLocalRate*currentRate;
                feeRelection.rsBlackRate = taxFee.sBlackRate*currentRate;
                feeRelection.rsLPRate = taxFee.sLPRate*currentRate;
            }
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

    function _tokenTransfer(address sender, address recipient, uint256 amount, uint256 ty) private {
        if (_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferFromExcluded(sender, recipient, amount, ty);
        } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
            _transferToExcluded(sender, recipient, amount, ty);
        } else if (_isExcluded[sender] && _isExcluded[recipient]) {
            _transferBothExcluded(sender, recipient, amount, ty);
        } else {
            _transferStandard(sender, recipient, amount, ty);
        }
    }

    function _reflectFee(uint256 rShareFree, uint256 tShareFree) private {
        if (rShareFree > 0){
            _rTotal = _rTotal-rShareFree;
            _tFeeTotal = _tFeeTotal+tShareFree;
        }
    }

    function _getRValues(uint256 tAmount, uint256 currentRate, uint256 ty) private view returns (uint256, uint256, uint256, TaxFeeReflection memory, TaxFee memory) {
        uint256 rAmount = tAmount*currentRate;
        (TaxFeeReflection memory feeRelection, TaxFee memory taxFee) = calculateTaxFeeReflection(tAmount, currentRate, ty);

        uint256 tTransferAmount;
        if (ty == 1){
            tTransferAmount = tAmount-taxFee.tLocalRate-taxFee.tBlackRate-taxFee.tLPRate;
        } else {
            tTransferAmount = tAmount-taxFee.sLocalRate-taxFee.sBlackRate-taxFee.sLPRate;
        }

        uint256 rTransferAmount;
        if (ty == 1){
            rTransferAmount = rAmount-feeRelection.rtLocalRate-feeRelection.rtBlackRate-feeRelection.rtLPRate;
        } else {
            rTransferAmount = rAmount-feeRelection.rsLocalRate-feeRelection.rsBlackRate-feeRelection.rsLPRate;
        }
        return (tTransferAmount, rAmount, rTransferAmount, feeRelection, taxFee);
    }

    function _transferStandard(address sender, address recipient, uint256 tAmount, uint256 ty) private {
        (uint256 tTransferAmount, uint256 rAmount, uint256 rTransferAmount, TaxFeeReflection memory feeRelection, TaxFee memory taxFee) = _getRValues(tAmount, _getRate(), ty);

        _rOwned[sender] = _rOwned[sender]-rAmount;
        _rOwned[recipient] = _rOwned[recipient]+rTransferAmount;

        _relationShare(sender, taxFee, feeRelection, ty);
        
        if (feeRelection.rtLocalRate > 0 || feeRelection.rsLocalRate > 0){
            if (ty == 1){
                _reflectFee(feeRelection.rtLocalRate, taxFee.tLocalRate);
            } else {
                _reflectFee(feeRelection.rsLocalRate, taxFee.sLocalRate);
            }
        }
        emit Transfer(sender, recipient, tTransferAmount);
    }
    
    // 接收者被排除
    function _transferToExcluded(address sender, address recipient, uint256 tAmount, uint256 ty) private {
        (uint256 tTransferAmount, uint256 rAmount, uint256 rTransferAmount, TaxFeeReflection memory feeRelection, TaxFee memory taxFee) = _getRValues(tAmount, _getRate(), ty);
        
        _rOwned[sender] = _rOwned[sender]-rAmount;
        _tOwned[recipient] = _tOwned[recipient]+tTransferAmount;
        _rOwned[recipient] = _rOwned[recipient]+rTransferAmount;

        _relationShare(sender, taxFee, feeRelection, ty);

        if (feeRelection.rtLocalRate > 0 || feeRelection.rsLocalRate > 0){
            if (ty == 1){
                _reflectFee(feeRelection.rtLocalRate, taxFee.tLocalRate);
            } else {
                _reflectFee(feeRelection.rsLocalRate, taxFee.sLocalRate);
            }
        }
        
        emit Transfer(sender, recipient, tTransferAmount);
    }

    // 发送者被排除
    function _transferFromExcluded(address sender, address recipient, uint256 tAmount, uint256 ty) private {
        (uint256 tTransferAmount, uint256 rAmount, uint256 rTransferAmount, TaxFeeReflection memory feeRelection, TaxFee memory taxFee) = _getRValues(tAmount, _getRate(), ty);

        _tOwned[sender] = _tOwned[sender]-tAmount;
        _rOwned[sender] = _rOwned[sender]-rAmount;
        _rOwned[recipient] = _rOwned[recipient]+rTransferAmount;
        
        _relationShare(sender, taxFee, feeRelection, ty);

        if (feeRelection.rtLocalRate > 0 || feeRelection.rsLocalRate > 0){
            if (ty == 1){
                _reflectFee(feeRelection.rtLocalRate, taxFee.tLocalRate);
            } else {
                _reflectFee(feeRelection.rsLocalRate, taxFee.sLocalRate);
            }
        }
        emit Transfer(sender, recipient, tTransferAmount);
    }

    // 两者都被排除
    function _transferBothExcluded(address sender, address recipient, uint256 tAmount, uint256 ty) private {
        (uint256 tTransferAmount, uint256 rAmount, uint256 rTransferAmount, TaxFeeReflection memory feeRelection, TaxFee memory taxFee) = _getRValues(tAmount, _getRate(), ty);
        
        _tOwned[sender] = _tOwned[sender]-tAmount;
        _rOwned[sender] = _rOwned[sender]-rAmount;
        _tOwned[recipient] = _tOwned[recipient]+tTransferAmount;
        _rOwned[recipient] = _rOwned[recipient]+rTransferAmount;
        
        _relationShare(sender, taxFee, feeRelection, ty);

        if (feeRelection.rtLocalRate > 0 || feeRelection.rsLocalRate > 0){
            if (ty == 1){
                _reflectFee(feeRelection.rtLocalRate, taxFee.tLocalRate);
            } else {
                _reflectFee(feeRelection.rsLocalRate, taxFee.sLocalRate);
            }
        }
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _relationShare(address sender, TaxFee memory taxFee, TaxFeeReflection memory feeRelection, uint ty) private {
        if (taxFee.tLPRate > 0 || taxFee.sLPRate > 0){
            if (ty == 1){
                _tOwned[address(this)] = _tOwned[address(this)]+taxFee.tLPRate;
                _rOwned[address(this)] = _rOwned[address(this)]+feeRelection.rtLPRate;
                _tOwned[address(0)] = _tOwned[address(0)]+taxFee.tBlackRate;
                _rOwned[address(0)] = _rOwned[address(0)]+feeRelection.rtBlackRate;
                emit Transfer(sender, address(this), taxFee.tLPRate);
                emit Transfer(sender, address(0), taxFee.tBlackRate);
            } else {
                _tOwned[address(this)] = _tOwned[address(this)]+taxFee.sLPRate;
                _rOwned[address(this)] = _rOwned[address(this)]+feeRelection.rsLPRate;
                _tOwned[address(0)] = _tOwned[address(0)]+taxFee.sBlackRate;
                _rOwned[address(0)] = _rOwned[address(0)]+feeRelection.rsBlackRate;
                emit Transfer(sender, address(this), taxFee.sLPRate);
                emit Transfer(sender, address(0), taxFee.sBlackRate);
            }
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
    uint256 private progressLPBlock;

    //执行LP分红，使用 gas(500000) 单位 gasLimit 去执行LP分红
    function processLP(uint256 gas) private {
        //间隔 10 分钟分红一次
        if (progressLPBlock + 200 > block.number) {
            return;
        }
        //交易对没有余额
        uint totalPair = uniswapV2Pair.totalSupply();
        if (totalPair == 0) {
            return;
        }

        uint256 balance = balanceOf(address(this));
        //分红小于分配条件，一般太少也就不分配
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
                //分红大于0进行分配，最小精度
                if (amount > 0) {
                    _tokenTransfer(address(this), shareHolder, amount, 1);
                }
            }

            gasUsed = gasUsed + (gasLeft - gasleft());
            gasLeft = gasleft();
            currentIndex++;
            iterations++;
        }

        progressLPBlock = block.number;
    }

    //是否排除LP分红
    function setExcludeLPProvider(address addr, bool enable) external onlyOwner {
        excludeLpProvider[addr] = enable;
    }
}
