// SPDX-License-Identifier: GPL-3.0

// author: Rahul Saxena | Github, Twitter: @saxenism

pragma solidity >=0.8.0 <0.9.0;

import './token_mint.sol';
import './token_shop.sol';

contract ShopTokenFactory {
    string public shopTokenName;
    string public shopTokenSymbol;
    uint256 public shopTokenSupply;
    uint8 public shopTokenDecimals;

    ShopTokenMint shopToken;
    address public tokenCreator;

    modifier isTokenDetailsProvided {
        require(shopTokenSupply != 0, "Total Supply not set");
        _;
    }

    modifier isTokenDeployed {
        require(address(shopToken) != address(0), "Token not yet deployed");
        _;
    }

    modifier onlyTokenCreator {
        require(msg.sender == tokenCreator, "Action can only be performed by token creator");
        _;
    }

    function setShopTokenDetails(string memory _shopTokenName,
                                 string memory _shopTokenSymbol,
                                 uint256 _shopTokenSupply,
                                 uint8 _shopTokenDecimals) public {
        shopTokenName = _shopTokenName;
        shopTokenSymbol = _shopTokenSymbol;
        shopTokenSupply = _shopTokenSupply;
        shopTokenDecimals = _shopTokenDecimals;
    }
    
    function createShopTokens() public isTokenDetailsProvided {
        ShopTokenMint _shopToken = new ShopTokenMint(shopTokenName,
                                            shopTokenSymbol,
                                            shopTokenSupply,
                                            shopTokenDecimals);
        tokenCreator = msg.sender;
        shopToken = _shopToken;
    }

    function getShopTokenDetails() public view isTokenDeployed returns(string memory, uint256, address) {
        return (shopToken.name(), shopToken.totalSupply(), address(shopToken));
    }

    /*
        TokenizedShop (token_shop.sol) functions, variables, modifiers, etc
    */
    TokenizedShop shop;
    address public shopOwner;

    modifier isShopCreated {
        require(address(shop) != address(0), "The shop is not deployed yet");
        _;
    }

    modifier onlyShopOwner {
        require(msg.sender == shopOwner, "Function can only be called by shop owner");
        _;
    }
 
    function createShop() onlyTokenCreator isTokenDeployed public {
        TokenizedShop _shop = new TokenizedShop();
        shop = _shop;
        shopOwner = msg.sender;
    }

    function getShopAddress() public view isShopCreated returns(address) {
        return address(shop);
    }
}
