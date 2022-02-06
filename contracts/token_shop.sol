// SPDX-License-Identifier: GPL-3.0

// author: Rahul Saxena | Github, Twitter: @saxenism

/*
Functions to implement:
1. function enlistItem()
2. function sellItem()
3. function changePriceForItem()

Lower Priority
4. function handleCancelRequestForItem()
5. function getCurrentStateForItem()
*/

pragma solidity >=0.8.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenizedShop {
    address public shopOwner;
    uint256 public itemID;
    struct ShopItem {
        string shopItemName;
        string shopItemDescription;
        string shopItemImage;
        uint256 shopItemPrice;
        uint256 shopItemQuantity;
        uint256 shopItemID;
    }
    mapping(uint256 => ShopItem) public shopItems;
    ShopItem[] public shopItemsArray;

    constructor() {
        shopOwner = tx.origin;
    }

    modifier onlyShopOwner() {
        require(tx.origin == shopOwner, "Function can only be called by the shopOwner");
        _;
    }

    function enlistItem(string memory name, 
                        string memory description,
                        string memory image,
                        uint256 price,
                        uint256 quantity) public returns (uint256) {
        ShopItem memory item;
        item.shopItemName = name;
        item.shopItemDescription = description;
        item.shopItemImage = image;
        item.shopItemPrice = price;
        item.shopItemQuantity = quantity;
        item.shopItemID = itemID;
        shopItems[itemID] = item;
        return (itemID++);
    }

    function displayItemByID(uint256 id) public view returns(ShopItem memory) {
        return shopItems[id];
    }

    function displayAllItems() public returns(ShopItem[] memory) {
        if(shopItemsArray.length != itemID) {
            for(uint256 i = shopItemsArray.length; i < itemID; i++) {
                shopItemsArray.push(shopItems[i]);
            }
        }
        return shopItemsArray;
    }

    function sellItem(uint256 id) payable public returns(bool) {
        require(id < itemID, "ID out of bounds");
        uint256 amountInUSD = shopItems[id].shopItemPrice;
        uint256 ratioOfPrices = uint256(getDerivedPrice());
        uint256 priceInMatic = ratioOfPrices * amountInUSD;
        require(msg.value >= priceInMatic, "Amount transferred is insufficient");
        if(msg.value > priceInMatic) {
            uint256 amountToReturn = msg.value - priceInMatic;
            payable(msg.sender).transfer(amountToReturn);
        }
        --shopItems[id].shopItemQuantity;
        return true;
    }

    function changePriceForItem(uint256 id, uint256 newPrice) public returns (ShopItem memory) {
        shopItems[id].shopItemPrice = newPrice;
        return shopItems[id];
    }

    function getShopOwner() public view returns(address) {
        return shopOwner;
    }

    function getDerivedPrice()
        public
        view
        returns (int256)
    {
        address _base = 0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0; // USDC/USD Polygon Mumbai Oracle Address
        address _quote = 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada; // MATIC/USD Polygon Mumbai Oracle Address
        uint8 _decimals = 18; // Decimal precision of Matic
        require(_decimals > uint8(0) && _decimals <= uint8(18), "Invalid _decimals");
        int256 decimals = int256(10 ** uint256(_decimals));
        ( , int256 basePrice, , , ) = AggregatorV3Interface(_base).latestRoundData();
        uint8 baseDecimals = AggregatorV3Interface(_base).decimals();
        basePrice = scalePrice(basePrice, baseDecimals, _decimals);

        ( , int256 quotePrice, , , ) = AggregatorV3Interface(_quote).latestRoundData();
        uint8 quoteDecimals = AggregatorV3Interface(_quote).decimals();
        quotePrice = scalePrice(quotePrice, quoteDecimals, _decimals);

        return basePrice * decimals / quotePrice;
    }

    function scalePrice(int256 _price, uint8 _priceDecimals, uint8 _decimals)
        internal
        pure
        returns (int256)
    {
        if (_priceDecimals < _decimals) {
            return _price * int256(10 ** uint256(_decimals - _priceDecimals));
        } else if (_priceDecimals > _decimals) {
            return _price / int256(10 ** uint256(_priceDecimals - _decimals));
        }
        return _price;
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function sendMatic(address payable gareeb) external {
        uint256 contractAmount = address(this).balance;
        gareeb.transfer(contractAmount);
    }
}