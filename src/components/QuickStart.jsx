import { Button, Form, Input, Typography, InputNumber, Card } from "antd";
import React, { useState, useEffect } from "react";
import { useMoralis, useERC20Balances } from "react-moralis";

const { Title, Paragraph } = Typography;

export default function QuickStart({ isServerInfo }) {
  const shopFactoryContractAddress = "0xE0Da7E56C3d8B39899d26eDF90361AE7D675FeC1";

  const [isTokenDetailsProvided, setIsTokenDetailsProvided] = useState(false);
  const [isTokenDeployed, setIsTokenDeployed] = useState(false);
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  const [queryShopAddressButton, setQueryShopAddressButton] = useState(false);

  // This set will store the values we get when we hit the getTokenDetails() function
  // in our smart contract
  const [retrievedTokenDetails, setRetrievedTokenDetails] = useState([]);

  const { Moralis, account } = useMoralis();
  const {Meta} = Card;

  function setDataInLocalStorage(varName, varValue) {
    localStorage.setItem(varName, varValue);
  }

  function getDataFromLocalStorage(varName) {
      let data = localStorage.getItem(varName);
      return data;
  }

  async function onTokenDetailsFormFinish(values) {
    console.log("Success:", values);

    await setTokenDetails(
      values.tokenName,
      values.tokenSymbol,
      values.tokenDecimals,
      values.tokenTotalSupply
    );

    setDataInLocalStorage("tokenName", values.tokenName);
    setDataInLocalStorage("tokenSymbol", values.tokenSymbol);
    setDataInLocalStorage("tokenDecimals", values.tokenDecimals);
    setDataInLocalStorage("tokenTotalSupply", values.tokenTotalSupply);

    setDataInLocalStorage("isTokenDetailsProvided", true);
    setIsTokenDetailsProvided(true);

    window.location.reload();
  };

  const onTokenDetailsFormFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  async function setTokenDetails(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply) {
    let contractOptionsSetShopTokenDetails = {
      contractAddress: shopFactoryContractAddress,
      functionName:"setShopTokenDetails",
      abi: [
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
        }
      ],
      params:{
        _shopTokenName: tokenName,
        _shopTokenSymbol: tokenSymbol,
        _shopTokenSupply: tokenTotalSupply,
        _shopTokenDecimals: tokenDecimals
      },
      msgValue: 0
    }
    
    await Moralis.executeFunction(contractOptionsSetShopTokenDetails);
  }

  async function deployToken() {
    let contractOptionsCreateShopTokens = {
      contractAddress: shopFactoryContractAddress,
      functionName:"createShopTokens",  
      abi: [
        {
          "inputs": [],
          "name": "createShopTokens",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    }

    await Moralis.executeFunction(contractOptionsCreateShopTokens);
    setDataInLocalStorage("isTokenDeployed", true);
    setIsTokenDeployed(true);
    setDataInLocalStorage("tokenDetailsOptions", true);
    window.location.reload();
  }

  async function queryUserStoreAddress() {
    let contractOptionsGetShopAddress = {
      contractAddress: shopFactoryContractAddress,
      functionName: "getShopAddress",
      abi: [
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
        }
      ],  
    }

    const result = await Moralis.executeFunction(contractOptionsGetShopAddress);
    console.log(result);
    localStorage.setItem("shopContractAddress", result);

    window.location.reload();
  }

  async function createUserStore() {
    let contractOptionsCreateShop = {
      contractAddress: shopFactoryContractAddress,
      functionName: "createShop",
      abi: [
        {
          "inputs": [],
          "name": "createShop",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
    }

    await Moralis.executeFunction(contractOptionsCreateShop);
    setQueryShopAddressButton(true);
  }
  async function fetchTokenDetails() {
    let contractOptionsGetShopTokenDetails = {
      contractAddress: shopFactoryContractAddress,
      functionName:"getShopTokenDetails",
      abi: [
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
        }
      ],
    }

    const result = await Moralis.executeFunction(contractOptionsGetShopTokenDetails);
    setRetrievedTokenDetails(result);
    setDataInLocalStorage("isTokenDataRetrieved", true);
    setDataInLocalStorage("tokenAddress", result[2]);
    setDataInLocalStorage("retrievedTokenTotalSupply", result[1].toString());

    window.location.reload();
  }

  async function fetchUserTokenBalance() {
    const options = {chain: "0x13881"}; //This is the Polgon Mumbai test net chain id

    const data = await Moralis.Web3API.account.getTokenBalances(options);
    const tokenAddress = getDataFromLocalStorage("tokenAddress");
    console.log(data);
    console.log(tokenAddress);
    for(let i = 0; i < data.length; i++) {
      if(data[i].token_address == tokenAddress.toLowerCase()) {
        setDataInLocalStorage("userTokenBalance", data[i].balance);
        setUserTokenBalance(data[i].balance);
        return data[i].balance;
      }
    }
  }

  function changeTokenDetails() {
    localStorage.clear();
    window.location.reload();
  }

  function showForm() {
    if(!account) {
      return false;
    }
    let tokenDetails = getDataFromLocalStorage("isTokenDetailsProvided");
    if(tokenDetails) {
      return false;
    } else {
      if(isTokenDetailsProvided) {
        return false;
      } else {
        return true;
      }
    }
  }

  function showDeployOptions() {
    let tokenDetails = getDataFromLocalStorage("isTokenDetailsProvided");
    if(!account || !tokenDetails) {
      return false;
    }
    let tokenDeployment = getDataFromLocalStorage("isTokenDeployed");
    if(tokenDeployment) {
      return false;
    } else {
      if(isTokenDeployed) {
        return false;
      } else {
        return true;
      }   
    }
  }

  function showDetailsOption() {
    let tokenDetails = getDataFromLocalStorage("isTokenDetailsProvided");
    let tokenDeployment = getDataFromLocalStorage("isTokenDeployed");
    if(!account || !tokenDetails || !tokenDeployment) {
      return false;
    }
    let tokenDetailsOptions = getDataFromLocalStorage("tokenDetailsOptions");
    let tokenData = getDataFromLocalStorage("isTokenDataRetrieved");
    if(tokenDeployment) {
      if(tokenDetailsOptions) {
        if(!tokenData) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function showTokenData() {
    let tokenDetails = getDataFromLocalStorage("isTokenDetailsProvided");
    let tokenDeployment = getDataFromLocalStorage("isTokenDeployed");
    if(!account || !tokenDetails || !tokenDeployment) {
      return false;
    }
    let tokenData = getDataFromLocalStorage("isTokenDataRetrieved");
    if(tokenData) {
      return true;
    } else {
      if(retrievedTokenDetails.length > 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  return (
    <div style={{ gap: "10px" }}>
      <Title level={1} style={{marginBottom: "30px"}}> ⚔️ MyTribe DAO ⚔️ </Title>
      {
        (!account) ? <Title level={4}>Please connect your wallet using the Authenticate Button</Title> : null
      }
      {
        showForm() ? <Form
          style={{marginBottom: "50px"}}
          name="basic"
          labelCol={{
            span: 256
          }}
          wrapperCol={{
            span: 16
          }}
          onFinish={onTokenDetailsFormFinish}
          onFinishFailed={onTokenDetailsFormFailed}
          autoComplete="off"
          size="large"
          layout="horizontal"
        >
          <Form.Item
            label="DAO Token Name"
            name="tokenName"
            initialValue={getDataFromLocalStorage("tokenName")}
            rules={[
              {
                required: true,
                message: "Input your token name!"
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="DAO Token Symbol"
            name="tokenSymbol"
            initialValue={getDataFromLocalStorage("tokenSymbol") ||""}
            rules={[
              {
                required: true,
                message: "Input your token symbol!"
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="DAO Token Decimals"
            name="tokenDecimals"
            initialValue={getDataFromLocalStorage("tokenDecimals") ||""}
            rules={[
              {
                required: true,
                message: "Input the decimal precision for your token!"
              }
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="DAO Token Supply"
            name="tokenTotalSupply"
            initialValue={getDataFromLocalStorage("tokenTotalSupply") ||""}
            rules={[
              {
                required: true,
                message: "Input total supply of your token!"
              }
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16
            }}
          >
            <Button type="danger" htmlType="submit">
              Set Token Details
            </Button>
          </Form.Item>
        </Form> : null 
      }
      {
        showDeployOptions() ? 
        <>
        <Button size = "large" type = "danger" onClick={deployToken}>Deploy Token</Button> 
        <br/>
        <br/>
        <Button size = "large" type = "primary" onClick={changeTokenDetails}>Change Token Details</Button>
        </>
        : 
        null
      }
      {
          showDetailsOption() ? 
          <>
          <Button size = "large" type = "danger" onClick={fetchTokenDetails}>Token Details</Button> 
          <br/>
          <br/>
          <Button size = "large" type = "primary" onClick={changeTokenDetails}>Change Token Details</Button>
          <br/>
          <br/>
          </>
          : 
          null
      }
      {
        showTokenData() ? 
        <>
          <Card title={`${getDataFromLocalStorage("tokenName")} Token (${getDataFromLocalStorage("tokenSymbol")})`}
                                    hoverable={true}
                                    bordered={true}
                                    cover={<img src={`https://pbs.twimg.com/profile_images/1401931168056967175/q4itcBEb_400x400.jpg`}/>}
                                    size="large">
            <Meta title = "Token Name" description = {getDataFromLocalStorage("tokenName")} />
            <br />
            <Meta title = "Token Symbol" description = {getDataFromLocalStorage("tokenSymbol")} />
            <br />
            <Meta title = "Token Supply" description = {getDataFromLocalStorage("retrievedTokenTotalSupply")} />
            <br />
            <Meta title = "Token Address" description = {<Paragraph copyable>{getDataFromLocalStorage("tokenAddress")}</Paragraph>} />
            <br />
            {
              (userTokenBalance || getDataFromLocalStorage("userTokenBalance")) ? 
              <>
              <Meta title = "Your Balance" description = {getDataFromLocalStorage("userTokenBalance") || userTokenBalance } />
              <br /> 
              </>
              :
              null
            }
            <Meta title = "Check Token on Polygonscan" description = {<p>View token on <a href={`https://mumbai.polygonscan.com/address/${getDataFromLocalStorage("tokenAddress")}`} >polygonscan</a></p>} />
            <br/>
            {
              (getDataFromLocalStorage("shopContractAddress")) ? 
              <>
              <Meta title = "Your Store Address" description = {<Paragraph copyable>{getDataFromLocalStorage("shopContractAddress") }</Paragraph>} />
              <br />
              <Meta title = "Check Store on Polygonscan" description = {<p>View store on <a href={`https://mumbai.polygonscan.com/address/${getDataFromLocalStorage("shopContractAddress")}`} >polygonscan</a></p>} /> 
              </>
              :
              null
            }
          </Card>
          <br/>
          <br/>
          <Button size = "large" type = "primary" onClick={fetchUserTokenBalance} style={{display:"inline-flex"}}>Query Token Balance</Button>
          <br/>
          <br/>
          {
            (localStorage.getItem("shopContractAddress")) ?
            null:
            !queryShopAddressButton ?
            <Button size = "large" type = "primary" onClick={createUserStore} style={{display:"inline-flex"}}>Create your store</Button> :
            <Button size = "large" type = "primary" onClick={queryUserStoreAddress} style={{display:"inline-flex"}}>Query Store Address</Button> 
          }
          <br/>
          <br/>
          <Button size = "large" type = "danger" onClick={changeTokenDetails} style={{display:"inline-flex"}}>Create New Token</Button>
        </>
        : null
      }
    </div>
  );
}
