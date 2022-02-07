import { useMoralis, useERC20Balances } from "react-moralis";
import { Col, Row, Button, Typography, Form, Input, InputNumber, Card, Skeleton } from "antd";
import { getEllipsisTxt } from "../helpers/formatters";

function ERC20Balance(props) {
  const { data: assets } = useERC20Balances(props);
  const { Moralis } = useMoralis();
  const { Title, Paragraph } = Typography;
  const { TextArea } = Input;
  const {Meta} = Card;

  const columns = [
    {
      title: "",
      dataIndex: "logo",
      key: "logo",
      render: (logo) => (
        <img
          src={logo || "https://etherscan.io/images/main/empty-token.png"}
          alt="nologo"
          width="28px"
          height="28px"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => symbol,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value, item) =>
        parseFloat(Moralis?.Units?.FromWei(value, item.decimals)).toFixed(6),
    },
    {
      title: "Address",
      dataIndex: "token_address",
      key: "token_address",
      render: (address) => getEllipsisTxt(address, 5),
    },
  ];

  function hex2decimal(s) {

    function add(x, y) {
        var c = 0, r = [];
        var x = x.split('').map(Number);
        var y = y.split('').map(Number);
        while(x.length || y.length) {
            var s = (x.pop() || 0) + (y.pop() || 0) + c;
            r.unshift(s < 10 ? s : s - 10); 
            c = s < 10 ? 0 : 1;
        }
        if(c) r.unshift(c);
        return r.join('');
    }

    var dec = '0';
    s.split('').forEach(function(chr) {
        var n = parseInt(chr, 16);
        for(var t = 8; t; t >>= 1) {
            dec = add(dec, dec);
            if(n & t) dec = add(dec, '1');
        }
    });
    return dec;
}

  async function queryStoreBalance() {
    let contractOptions = {
      contractAddress: "0x4bD53ED8c1d3f2207F51CD72b9A39969b80867a7",
      functionName: "contractKaBalancePataKaro",
      abi: [
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
        }
      ]
    };

    const balance = await Moralis.executeFunction(contractOptions);
    const balanceInMatic = (parseInt(hex2decimal(balance._hex.toString()))/1000000000000000000);
    localStorage.setItem("storeBalance", balanceInMatic);

    window.location.reload();
  }

  async function claimDividend() {
    let contractOptions = {
      contractAddress: "0x4bD53ED8c1d3f2207F51CD72b9A39969b80867a7",
      functionName: "mujheAadhaPaisaDo",
      abi: [
        {
          "inputs": [],
          "name": "mujheAadhaPaisaDo",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    };

    await Moralis.executeFunction(contractOptions);
    localStorage.setItem("claimed", true);
    window.location.reload();
  }

  async function sendMoney() {
    let contractOptions = {
      contractAddress: "0x4bD53ED8c1d3f2207F51CD72b9A39969b80867a7",
      functionName: "paiseBhejDo",
      abi: [
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
      ],
      msgValue: 4000000000000000000,
    }

    await Moralis.executeFunction(contractOptions);
  }

  return (
    <div style={{ width: "65vw", padding: "15px" }}>
      <Title level={2}>💰Claim Dividend Share</Title>
      <br/>
      <Skeleton loading={!assets}>
        <div style={{padding: "30px", display:"flex"}}>
          <Row gutter={16}> 
            <Col span={8}>
              <Card title={`My Dividend Dashboard`}
                                        hoverable={true}
                                        bordered={true}
                                        cover={<img src={`https://www.stash.com/learn/wp-content/uploads/2017/01/learn_jargonhackdividend_1100x450.jpg`}/>}
                                        size="large">
                  <Meta title = "My Asset Name" description = {<Paragraph>{localStorage.getItem("tokenName")}</Paragraph>} />
                  <br />
                  <Meta title = "My Asset Address" description = {<Paragraph copyable>{localStorage.getItem("tokenAddress")}</Paragraph>} />
                  <br />
                  <Meta title = "My Asset Decimals" description = {<Paragraph>{localStorage.getItem("tokenDecimals")}</Paragraph>} />
                  <br />
                  <Meta title = "My Asset Holding" description = {<Paragraph>{localStorage.getItem("tokenTotalSupply")/4}</Paragraph>} />
                  <br />
                  <Meta title = "Asset Total Supply" description = {<Paragraph>{localStorage.getItem("tokenTotalSupply")}</Paragraph>} />
                  <br />
                  <Meta title = "My percentage holding" description = {<Paragraph>{`50.001%`}</Paragraph>} />
                  <br />
                  {
                    !localStorage.getItem("storeBalance") ?
                      null
                    :
                    <>
                    <Meta title = "Store Total Balance" description = {<Paragraph>{localStorage.getItem("storeBalance")}</Paragraph>} />
                    <br />
                    </>
                  }
                  <br />
                  {
                    !localStorage.getItem("claimed") ?
                    <>
                    <Button type="danger" size = "large" onClick = {claimDividend}>Claim Dividend</Button>
                    <br />
                    <br />
                    </>
                    :
                    null
                  }
                  <Button type="danger" size = "large" onClick={queryStoreBalance}>Query Store Balance</Button>
              </Card>
            </Col>
          </Row>
        </div>
      </Skeleton>
    </div>
  );
}
export default ERC20Balance;
