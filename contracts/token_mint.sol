// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

contract ShopTokenMint is ERC20, ERC20Snapshot {

    uint8 shopTokenDecimals;
    uint256 protocolFee;
    uint256 shopOwnerTokens;
    address protocolFeeCollector = 0x917A525DEe98DF975C8D47C5510BF0493f9C8299;
    address shopOwner;
    uint256 public snapshotID;

    constructor(string memory _tokenName, 
                string memory _tokenSymbol,
                uint256 _tokenSupply,
                uint8 _tokenDecimals) ERC20(_tokenName, _tokenSymbol){
        shopTokenDecimals = _tokenDecimals;
        shopOwnerTokens = (_tokenSupply * 95) / (100);
        protocolFee = _tokenSupply - shopOwnerTokens;
        shopOwner = msg.sender;
        _mint(tx.origin, shopOwnerTokens);
        _mint(protocolFeeCollector, protocolFee);
    }

    modifier onlyShopOwner() {
        require(msg.sender == shopOwner, "Function can only be called by the shopOwner");
        _;
    }

    function decimals() public view virtual override returns (uint8) {
        return shopTokenDecimals;
    }

    function takeSnapshot() public onlyShopOwner returns(uint256) {
        snapshotID = _snapshot();
        return snapshotID;
    }

    function viewCurrentBalance(address shopTokenHodler) public returns (uint256) {
        if(snapshotID == 0) {
            snapshotID = takeSnapshot();
        } 
        uint256 hodlerBalance = balanceOfAt(shopTokenHodler, snapshotID);
        return hodlerBalance;
    }

    function getTokenAddress() public view returns(address) {
        return (address(this));
    }

    // Overriding functions that are present in multiple parent classes XD
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }
}



/*

    function getSnapshotID() public isTokenDeployed returns(uint256) {
        snapshotID = shopToken.snapshotID();
        return snapshotID;
    }

    function getBalanceAtSnapshotID(address potentialHodler) public isTokenDeployed returns(uint256) {
        return shopToken.viewCurrentBalance(potentialHodler);
    }

*/