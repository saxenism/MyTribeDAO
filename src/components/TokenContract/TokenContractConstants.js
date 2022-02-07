const tokenFactoryABI = `[
	{
		"inputs": [],
		"name": "createShop",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "createShopTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_shopTokenName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_shopTokenSymbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_shopTokenSupply",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_shopTokenDecimals",
				"type": "uint8"
			}
		],
		"name": "setShopTokenDetails",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getShopAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getShopTokenDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shopOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shopTokenDecimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shopTokenName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shopTokenSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shopTokenSymbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenCreator",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
`;

const tokenizedShopABI = `[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "changePriceForItem",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "shopItemName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "shopItemDescription",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "shopItemImage",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "shopItemPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "shopItemQuantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "shopItemID",
						"type": "uint256"
					}
				],
				"internalType": "struct TokenizedShop.ShopItem",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "displayAllItems",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "shopItemName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "shopItemDescription",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "shopItemImage",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "shopItemPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "shopItemQuantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "shopItemID",
						"type": "uint256"
					}
				],
				"internalType": "struct TokenizedShop.ShopItem[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "displayItemByID",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "shopItemName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "shopItemDescription",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "shopItemImage",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "shopItemPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "shopItemQuantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "shopItemID",
						"type": "uint256"
					}
				],
				"internalType": "struct TokenizedShop.ShopItem",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "image",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "enlistItem",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDerivedPrice",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getShopOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "itemID",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "sellItem",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "gareeb",
				"type": "address"
			}
		],
		"name": "sendMatic",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "shopItems",
		"outputs": [
			{
				"internalType": "string",
				"name": "shopItemName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "shopItemDescription",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "shopItemImage",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "shopItemPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "shopItemQuantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "shopItemID",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "shopItemsArray",
		"outputs": [
			{
				"internalType": "string",
				"name": "shopItemName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "shopItemDescription",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "shopItemImage",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "shopItemPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "shopItemQuantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "shopItemID",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shopOwner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

`;

const scamContractABI = `[
	{
		"inputs": [],
		"name": "contractKaBalancePataKaro",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mujheAadhaPaisaDo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paiseBhejDo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	}
]
`;

export {tokenFactoryABI, tokenizedShopABI};

