import React, {useState} from "react";
import { useMoralis} from "react-moralis";
import "antd/dist/antd.css";
import { Col, Row, Button, Typography, Form, Input, InputNumber, Card } from "antd";

function CreateStore() {
   const { Moralis } = useMoralis();
   const { Title, Paragraph } = Typography;
   const { TextArea } = Input;
   const {Meta} = Card;

   const [uploadedImage, setUploadedImage] = useState('');
   const [showItemCard, setShowItemCard] = useState(false);
   const [imageHash, setImageHash] = useState('');
   const [queryItemID, setQueryItemID] = useState(false);

   const shopContractAddress = localStorage.getItem('shopContractAddress');

    async function uploadImage(event) {
        const data = event.target.files[0];
        const file = new Moralis.File(data.name, data);
        await file.saveIPFS();

        setUploadedImage(file.ipfs());
        setImageHash(file.hash());

        console.log(file.ipfs());
    }

    function saveShopItemDetails(name, price, description, image, hash, quantity) {
        if(!localStorage.getItem("shopItems")) {
            localStorage.setItem('shopItems', "[]");
        }

        let newDataObject = {
            "itemName": name,
            "itemPrice": price,
            "itemDescription": description,
            "uploadedImage": image,
            "imageHash": hash,
            "itemQuantity": quantity
        }
        let oldData = JSON.parse(localStorage.getItem('shopItems'));
        oldData.push(newDataObject);

        localStorage.setItem('shopItems', JSON.stringify(oldData));

        //This is setting up the boolean value so that the item card becomes visible
        localStorage.setItem("showCard", true);
    }

    function removeAllShopItems() {
        localStorage.setItem("shopItems", "[]");
        window.location.reload();
    }

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

    async function priceConversionFunction(usdAmount) {
        let contractOptionsGetDerivedPrice = {
            contractAddress: shopContractAddress,
            functionName: "getDerivedPrice",
            abi: [
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
                }
            ],
        }
        const basedPrice = await Moralis.executeFunction(contractOptionsGetDerivedPrice);
        console.log(basedPrice._hex.toString());
        let decimalString = hex2decimal(basedPrice._hex.toString());
        decimalString = decimalString.substring(0,2);
        console.log(decimalString);
        let maticBasePrice = parseInt(decimalString);
        let priceInMatic = (usdAmount * maticBasePrice) / 100;
        console.log(priceInMatic);

        localStorage.setItem("priceInMatic", priceInMatic);

        window.location.reload();
    } 

    async function getItemID() {
        let contractOptionsItemID = {
            contractAddress: shopContractAddress,
            functionName: "itemID",
            abi: [
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
                }
            ]
        }
        const itemID = await Moralis.executeFunction(contractOptionsItemID);
        console.log("ItemID: ", itemID);   

        localStorage.setItem("jugaadItemID", (itemID-1));

        //Appending the itemID to the uploaded objects:
        let oldData = JSON.parse(localStorage.getItem('shopItems'))
        let newField = {"itemID": itemID}
        let i = oldData.length - 1;
        oldData[i] = {...oldData[i], newField};
        localStorage.setItem('shopItems', JSON.stringify(oldData));

        window.location.reload();

        setQueryItemID(true);
    }

    async function enlistItem(itemName, itemDescription, itemImage, itemPrice, itemQuantity) {
        let contractOptionsEnlistItem = {
            contractAddress:shopContractAddress,
            functionName:"enlistItem",
            abi: [
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
                }
            ],
            params: {
                name: itemName,
                description: itemDescription,
                image: itemImage,
                price: itemPrice,
                quantity: itemQuantity,
            }
        }
        console.log(itemName, itemDescription, itemImage, itemPrice, itemQuantity);
        await Moralis.executeFunction(contractOptionsEnlistItem);

        setQueryItemID(true);
    }

    function checkExistanceOfItemID() {
        let itemArray = JSON.parse(localStorage.getItem("shopItems"));
        let length = itemArray.length;
        return (!itemArray[length - 1].itemID ? false : true);
    }

  async function onItemUploadFinish(values) {
    saveShopItemDetails(values.itemName, values.itemPrice, values.itemDescription, uploadedImage, imageHash, values.itemQuantity);
    setShowItemCard(true);
    console.log("Success: ", values);
    
    window.location.reload();
  }

  async function onItemUploadFailed(errorInfo) {
    console.log("Failed:", errorInfo);
  }

  return (
    <div style={{ textAlign:"center", width: "80vw", padding: "15px" }}>
         <Title style={{marginBottom: "30px"}}>Create your DAO Store</Title>
        <br/>
        <br/>
            <Title level={3} underline={true}>Upload Image For Item #{localStorage.getItem("shopItems") && (JSON.parse(localStorage.getItem("shopItems")).length) || 0}</Title>
                <br/>
                <input type="file" name="fileInput" id="fileInput" onChange={uploadImage} style={{marginLeft:'100px'}}/>
                <br/>
                <br/>
            <Title level={3} underline={true}>Upload Details For Item #{localStorage.getItem("shopItems") && (JSON.parse(localStorage.getItem("shopItems")).length) || 0}</Title>
                <br/>
        {
            <Form
                labelWrap={true}
                style={{marginBottom: "50px"}}
                name="basic"
                labelCol={{
                span: 256
                }}
                wrapperCol={{
                span: 16
                }}
                onFinish={onItemUploadFinish}
                onFinishFailed={onItemUploadFailed}
                autoComplete="off"
                size="large"
                layout="horizontal"
            >
                <Form.Item
                label="Shop Item Name"
                name="itemName"
                rules={[
                    {
                    required: true,
                    message: "Input item name!"
                    }
                ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                label="Shop Item Description"
                name="itemDescription"
                rules={[
                    {
                    required: true,
                    message: "Input item description!"
                    }
                ]}
                >
                    <TextArea size="large" />
                </Form.Item>
                <Form.Item
                label="Shop Item Price (in USD)"
                name="itemPrice"
                rules={[
                    {
                    required: true,
                    message: "Input item price!",
                    }
                ]}
                >
                     <InputNumber placeholder="$USD" style={{width:"100%"}}/>
                </Form.Item>
                <Form.Item
                label="Shop Item Quantity"
                name="itemQuantity"
                rules={[
                    {
                    required: true,
                    message: "Input item quantity!",
                    }
                ]}
                >
                     <InputNumber placeholder="Quantity" style={{width:"100%"}}/>
                </Form.Item>
                <Form.Item >
                    <Button type="danger" htmlType="submit" style={{display:"flex-grow", textAlign:"center" }}>
                        Upload Shop Item
                    </Button>
                </Form.Item>
            </Form>
        }
        <br/>
        <br/>
        <br/>
        <br/>
        {   
            !(showItemCard || localStorage.getItem("showCard")) ? 
                    null :
                    <>
                    <Title level={4} > Uploaded Item Details </Title>
                    <br/>
                    <div style={{padding: "30px"}}>
                        <Row gutter={16}>
                            {
                                JSON.parse(localStorage.getItem("shopItems")).map((shopItem, index) =>
                                    <Col span={8}>
                                        <Card title={`#${index + 1} ${shopItem.itemName}`}
                                        hoverable={true}
                                        bordered={true}
                                        cover={<img src={shopItem.uploadedImage}/>}
                                        size="large"
                                        >
                                            <Meta title = "Item Description" description = {shopItem.itemDescription} />
                                            <br />
                                            <Meta title = "Item Price" description = {shopItem.itemPrice} />
                                            <br />
                                            <Meta title = "Item Quantity" description = {shopItem.itemQuantity} />
                                            <br />
                                            <Meta title = "Uploaded Image URL" description = {<Paragraph copyable>{shopItem.uploadedImage}</Paragraph>} />
                                            <br/>
                                            <Meta title = "Image IPFS Hash" description = {shopItem.imageHash} />
                                            <br />
                                            {
                                                checkExistanceOfItemID ?
                                                <>
                                                <Meta title = "Item ID" description = {localStorage.getItem("jugaadItemID")} />
                                                <br />
                                                </>
                                                :
                                                null
                                            }
                                            {
                                                localStorage.getItem("priceInMatic") ?
                                                <>
                                                <Meta title = "Price In $MATIC" description = {<Paragraph>{localStorage.getItem("priceInMatic")} MATIC</Paragraph>} />
                                                <br />                                                
                                                </>
                                                :
                                                null
                                            }
                                            {
                                                queryItemID ?
                                                <Button onClick={getItemID}>Get Item ID</Button>
                                                :
                                                <Button onClick={() => {enlistItem(shopItem.itemName,
                                                    shopItem.itemDescription,
                                                    shopItem.uploadedImage,
                                                    shopItem.itemPrice,
                                                    shopItem.itemQuantity)}}>Enlist Item</Button>
                                            }
                                            <Button onClick={() => {priceConversionFunction(shopItem.itemPrice)}}>Get Price in $MATIC</Button>
                                        </Card>
                                    </Col>   
                                )
                            }
                        </Row>
                    </div>
                    </> 
        }
        <br />
        <br />
        <Button size="large" type="danger" onClick={removeAllShopItems}>Remove all items</Button>
        <Button size="large" type="danger" onClick={() => setQueryItemID(true)}>Testing Shit</Button>
    </div>
  );
}

export default CreateStore;
