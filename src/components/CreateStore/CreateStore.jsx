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

    async function uploadImage(event) {
        const data = event.target.files[0];
        const file = new Moralis.File(data.name, data);
        await file.saveIPFS();

        setUploadedImage(file.ipfs());
        setImageHash(file.hash());
    }

//   async function uploadIPFSTestFunction() {
//     const someRandomObject = {
//         "someKey": "someValue"
//     }

//     const file = new Moralis.File("file.json", {base64: btoa(JSON.stringify(someRandomObject))});
//     const result = await file.saveIPFS();
//     console.log(result.ipfs());
//   }

    function saveShopItemDetails(name, price, description, image, hash) {
        if(!localStorage.getItem("shopItems")) {
            localStorage.setItem('shopItems', "[]");
        }

        let newDataObject = {
            "itemName": name,
            "itemPrice": price,
            "itemDescription": description,
            "uploadedImage": image,
            "imageHash": hash
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

  async function onItemUploadFinish(values) {
    setShowItemCard(true);
    saveShopItemDetails(values.itemName, values.itemPrice, values.itemDescription, uploadedImage, imageHash);
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
            <Title level={3} underline={true}>Upload Image For Item #{JSON.parse(localStorage.getItem("shopItems")).length}</Title>
                <br/>
                <input type="file" name="fileInput" id="fileInput" onChange={uploadImage} style={{marginLeft:'100px'}}/>
                <br/>
                <br/>
            <Title level={3} underline={true}>Upload Details For Item #{JSON.parse(localStorage.getItem("shopItems")).length}</Title>
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
                label="Shop Item Price (in USDC)"
                name="itemPrice"
                rules={[
                    {
                    required: true,
                    message: "Input item price!",
                    }
                ]}
                >
                     <InputNumber placeholder="USDC" style={{width:"100%"}}/>
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
                                            <Meta title = "Uploaded Image URL" description = {<Paragraph copyable>{shopItem.uploadedImage}</Paragraph>} />
                                            <br/>
                                            <Meta title = "Image IPFS Hash" description = {shopItem.imageHash} />
                                            <br />
                                            <Button onClick={()=>console.log("Fucked")}>Please fuck Me daddy</Button>
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
    </div>
  );
}

export default CreateStore;
