import axios from "axios";

const covalentAPIKey = "ckey_b6aa47493b8648339e1913eea4a";

const covalentClient = axios.create({
    auth: {
      username: covalentAPIKey,
      password: ''
    }
});

async function getERC20Balances() {
    try {
      const result = await covalentClient.get(`https://api.covalenthq.com/v1/1/tokens/0x3883f5e181fccaf8410fa61e12b59bad963fb645/token_holders/`);
      console.log(result);
      let holderData = (result.data.data.items[0]);
      console.log(holderData);
    } catch (error) {
      if (error.response) {
        console.log('api response error', error.response);
        if (error.response.data) {
          return error.response.data.error_message;
        }
        return error.response;
      } else if (error.request) {
        console.log('api request error', error.request);
        return error.request;
      } else {
        console.log('unexpected api error', error.message);
        return error.message;
      }
    }
}

export {getERC20Balances};