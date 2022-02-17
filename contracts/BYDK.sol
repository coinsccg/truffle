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

library SafeMath {
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
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

contract BYDK is Context, IERC20 {
    using SafeMath for uint256;

    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => Relation) private _relation;

    uint8 private _decimal;
    uint256 private constant MAX = ~uint256(0);
    uint256 private _tTotal;
    uint256 private _rTotal;
    uint256 private _tFeeTotal;

    uint256 public _burnMinLimit;
    uint256 public _maxTxAmount;

    uint256 public _directPushFree;
    uint256 public _indirectPushFree;
    uint256 public _blackHoleFree;
    uint256 public _shareFree;
    uint256 public _fundFree;
    uint256 public _biddingFree;

    uint256 private _preDirectPushFree;
    uint256 private _preIndirectPushFree;
    uint256 private _preBlackHoleFree;
    uint256 private _preShareFree;
    uint256 private _preFundFree;
    uint256 private _preBiddingFree;

    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    mapping (address => bool) private _isExcludedFromFee;
    mapping (address => bool) private _isExcluded;
    
    string private _name;
    string private _symbol;

    address private _owner;
    address private _fundAddress;
    address private _actionAddress;

    address[] private _excluded;

    struct Relation {
        address first;
        address second;
    }

    struct TaxFee {
        uint256 tDirectPushFree;
        uint256 tIndirectPushFree;
        uint256 tShareFree;
        uint256 tFundFree;
        uint256 tBiddingFree;
        uint256 tBlackHoleFree;
    }

    struct TaxFeeReflection {
        uint256 rDirectPushFree;
        uint256 rIndirectPushFree;
        uint256 rBlackHoleFree;
        uint256 rShareFree;
        uint256 rFundFree;
        uint256 rBiddingFree;
    }
    
    constructor(address fundAddress_, address actionAddress_) {
        _owner = msg.sender;
        _name = "BY DK TOKEN";
        _symbol = "BYDK";
        _decimal = 18;
        
        _tTotal = 2000000 * 10**_decimal;
        _rTotal = (MAX - (MAX % _tTotal));

        _rOwned[_owner] = _rTotal;

        _burnMinLimit = 50000 * 10**_decimal;
        _maxTxAmount = 500000 * 10 ** _decimal;

        _directPushFree = 2;
        _indirectPushFree = 1;
        _blackHoleFree = 3;
        _shareFree = 2;
        _fundFree = 4;
        _biddingFree = 3;

        _fundAddress = fundAddress_;
        _actionAddress = actionAddress_;
    }

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
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
        // require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        if(sender != _owner && recipient != _owner) require(amount <= _maxTxAmount, "Transfer amount exceeds the maxTxAmount.");

        _tokenTransfer(sender, recipient, amount);
        emit Transfer(sender, recipient, amount);
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

    function setTaxFeePercent(uint256 shareFree_, uint256 directPushFree_, uint256 indirectPushFree_, uint256 blackHoleFree_, uint256 fundFree_, uint256 biddingFree_) external onlyOwner {
        _directPushFree = directPushFree_;
        _indirectPushFree = indirectPushFree_;
        _blackHoleFree = blackHoleFree_;
        _shareFree = shareFree_;
        _fundFree = fundFree_;
        _biddingFree = biddingFree_;
    }
    
    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Amount must be less than total reflections");
        uint256 currentRate =  _getRate();
        return rAmount.div(currentRate);
    }

    function calculateTaxFee(uint256 _amount) private view returns (TaxFee memory taxFee) {
        taxFee.tDirectPushFree = _amount.mul(_directPushFree).div(100);
        taxFee.tIndirectPushFree = _amount.mul(_indirectPushFree).div(100);
        taxFee.tShareFree = _amount.mul(_shareFree).div(100);
        taxFee.tFundFree = _amount.mul(_fundFree).div(100);
        taxFee.tBiddingFree = _amount.mul(_biddingFree).div(100);
        
        if ((_tTotal - _tOwned[address(0)]) >= _burnMinLimit){
            taxFee.tBlackHoleFree = _amount.mul(_blackHoleFree).div(100);
        }

        return taxFee;
    }

    function calculateTaxFeeReflection(uint256 _amount, uint256 currentRate) private view returns (TaxFeeReflection memory feeRelection) {
        TaxFee memory taxFee = calculateTaxFee(_amount);
    
        feeRelection.rDirectPushFree = taxFee.tDirectPushFree.mul(currentRate);
        feeRelection.rIndirectPushFree = taxFee.tIndirectPushFree.mul(currentRate);
        feeRelection.rBlackHoleFree = taxFee.tBlackHoleFree.mul(currentRate);
        feeRelection.rShareFree = taxFee.tShareFree.mul(currentRate);
        feeRelection.rFundFree = taxFee.tFundFree.mul(currentRate);
        feeRelection.rBiddingFree = taxFee.tBiddingFree.mul(currentRate);

        return feeRelection;
    }

    function _getRate() private view returns(uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply.div(tSupply);
    }

    function _getCurrentSupply() private view returns(uint256, uint256) {
        uint256 rSupply = _rTotal;
        uint256 tSupply = _tTotal;
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_rOwned[_excluded[i]] > rSupply || _tOwned[_excluded[i]] > tSupply) return (_rTotal, _tTotal);
            rSupply = rSupply.sub(_rOwned[_excluded[i]]);
            tSupply = tSupply.sub(_tOwned[_excluded[i]]);
        }
        if (rSupply < _rTotal.div(_tTotal)) return (_rTotal, _tTotal); // rTotal - m * (rTotal/tTotal) >= rTotal/tTotal ==> m <= tTotal
        return (rSupply, tSupply);
    }

    function removeAllFee() private {
        if(_directPushFree == 0 && _indirectPushFree == 0 && _blackHoleFree == 0 && _shareFree == 0 && _fundFree == 0 && _biddingFree == 0) return;

        _preDirectPushFree = _directPushFree;
        _preIndirectPushFree = _indirectPushFree;
        _preBlackHoleFree = _blackHoleFree;
        _preShareFree = _shareFree;
        _preFundFree = _fundFree;
        _preBiddingFree = _biddingFree;

        _directPushFree = 0;
        _indirectPushFree = 0;
        _blackHoleFree = 0;
        _shareFree = 0;
        _fundFree = 0;
        _biddingFree = 0;
    }
    
    function restoreAllFee() private {
        _directPushFree = _preDirectPushFree;
        _indirectPushFree = _preIndirectPushFree;
        _blackHoleFree = _preBlackHoleFree;
        _shareFree = _preShareFree;
        _fundFree = _preFundFree;
        _biddingFree = _preBiddingFree;
    }

    function _tokenTransfer(address sender, address recipient, uint256 amount) private {
        if (_isExcluded[sender] && !_isExcluded[recipient]) {
            removeAllFee();
            _transferFromExcluded(sender, recipient, amount);
            restoreAllFee();
        } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
            removeAllFee();
            _transferToExcluded(sender, recipient, amount);
            restoreAllFee();
        } else if (!_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferStandard(sender, recipient, amount);
        } else if (_isExcluded[sender] && _isExcluded[recipient]) {
            removeAllFee();
            _transferBothExcluded(sender, recipient, amount);
            restoreAllFee();
        } else {
            _transferStandard(sender, recipient, amount);
        }
    }

    function _reflectFee(uint256 rShareFree, uint256 tShareFree) private {
        _rTotal = _rTotal.sub(rShareFree);
        _tFeeTotal = _tFeeTotal.add(tShareFree);
    }

    function _getTValues(uint256 tAmount) private view returns (uint256) {
        TaxFee memory taxFee = calculateTaxFee(tAmount);
        uint256 tTransferAmount = tAmount.sub(taxFee.tDirectPushFree).sub(taxFee.tIndirectPushFree).sub(taxFee.tBlackHoleFree).sub(taxFee.tShareFree).sub(taxFee.tFundFree).sub(taxFee.tBiddingFree);
        return tTransferAmount;
    }

    function _getRValues(uint256 tAmount, uint256 currentRate) private view returns (uint256, uint256) {
        uint256 rAmount = tAmount.mul(currentRate);
        TaxFeeReflection memory feeRelection = calculateTaxFeeReflection(tAmount, currentRate);
        uint256 rTransferAmount = rAmount.sub(feeRelection.rDirectPushFree).sub(feeRelection.rIndirectPushFree).sub(feeRelection.rBlackHoleFree).sub(feeRelection.rShareFree).sub(feeRelection.rFundFree).sub(feeRelection.rBiddingFree);
        return (rAmount, rTransferAmount);
    }

    function _transferStandard(address sender, address recipient, uint256 tAmount) private {
        uint256 tTransferAmount = _getTValues(tAmount);
        TaxFee memory taxFee = calculateTaxFee(tAmount);
        (uint256 rAmount, uint256 rTransferAmount) = _getRValues(tAmount, _getRate());
        TaxFeeReflection memory feeRelection = calculateTaxFeeReflection(tAmount,  _getRate());

        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);

        _relationShare(sender, recipient, taxFee, feeRelection);

        _reflectFee(feeRelection.rShareFree, taxFee.tShareFree);
        emit Transfer(sender, recipient, tTransferAmount);
    }
    function _transferToExcluded(address sender, address recipient, uint256 tAmount) private {
        uint256 tTransferAmount = _getTValues(tAmount);
        TaxFee memory taxFee = calculateTaxFee(tAmount);
        (uint256 rAmount, uint256 rTransferAmount) = _getRValues(tAmount, _getRate());
        TaxFeeReflection memory feeRelection = calculateTaxFeeReflection(tAmount,  _getRate());
        
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);

        _relationShare(sender, recipient, taxFee, feeRelection);

        _reflectFee(feeRelection.rShareFree, taxFee.tShareFree);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferFromExcluded(address sender, address recipient, uint256 tAmount) private {
        uint256 tTransferAmount = _getTValues(tAmount);
        TaxFee memory taxFee = calculateTaxFee(tAmount);
        (uint256 rAmount, uint256 rTransferAmount) = _getRValues(tAmount, _getRate());
        TaxFeeReflection memory feeRelection = calculateTaxFeeReflection(tAmount,  _getRate());

        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        
        _reflectFee(feeRelection.rShareFree, taxFee.tShareFree);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferBothExcluded(address sender, address recipient, uint256 tAmount) private {
        uint256 tTransferAmount = _getTValues(tAmount);
        TaxFee memory taxFee = calculateTaxFee(tAmount);
        (uint256 rAmount, uint256 rTransferAmount) = _getRValues(tAmount, _getRate());
        TaxFeeReflection memory feeRelection = calculateTaxFeeReflection(tAmount,  _getRate());
        
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        
        _reflectFee(feeRelection.rShareFree, taxFee.tShareFree);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _relationShare(address sender, address recipient, TaxFee memory taxFee, TaxFeeReflection memory feeRelection) private {
        if (_relation[recipient].first == address(0)){
            _relation[recipient].first = sender;
            _relation[recipient].second = _relation[sender].first;
        }
        _tOwned[_fundAddress] = _tOwned[_fundAddress].add(taxFee.tFundFree);
        _rOwned[_fundAddress] = _rOwned[_fundAddress].add(feeRelection.rFundFree);
        _tOwned[_actionAddress] = _tOwned[_actionAddress].add(taxFee.tBiddingFree);
        _rOwned[_actionAddress] = _rOwned[_actionAddress].add(feeRelection.rBiddingFree);
        _tOwned[address(0)] = _tOwned[address(0)].add(taxFee.tBlackHoleFree);
        _rOwned[address(0)] = _rOwned[address(0)].add(feeRelection.rBlackHoleFree);

        address first = _relation[sender].first;
        address second = _relation[sender].second;

        if (first != address(0)){
            _rOwned[first] = _rOwned[first].add(feeRelection.rDirectPushFree);
        }
        if (second != address(0)){
            _rOwned[second] = _rOwned[second].add(feeRelection.rIndirectPushFree);
        }

        if (first == address(0)){
            _tOwned[address(0)] = _tOwned[address(0)].add(taxFee.tDirectPushFree);
            _rOwned[address(0)] = _rOwned[address(0)].add(feeRelection.rDirectPushFree);
        }
        
        if (second == address(0)){
            _tOwned[address(0)] = _tOwned[address(0)].add(taxFee.tIndirectPushFree);
            _rOwned[address(0)] = _rOwned[address(0)].add(feeRelection.rIndirectPushFree);
        }
    }


}
