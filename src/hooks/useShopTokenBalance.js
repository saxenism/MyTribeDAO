import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

export const useShopTokenBalance = (params) => {
  const { account } = useMoralisWeb3Api();
  const { isInitialized, chainId, account: walletAddress } = useMoralis();

  const [assets, setAssets] = useState();

  useEffect(() => {
    if (isInitialized) {
      fetchShopTokenBalance().then((balance) => setAssets(balance));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, walletAddress]);

  const fetchERC20Balance = async () => {
    return await account
      .getTokenBalances({ address: walletAddress, chain: params?.chain || chainId })
      .then((result) => result);
  };

  const fetchShopTokenBalance = async() => {
      const shopTokenAddress = localStorage.getItem("tokenAddress");
      const userTokens = await account.getTokenBalances({ address: walletAddress, chain: params?.chain || chainId });
      for(let i = 0; i < userTokens.length; i++) {
          if(userTokens[i].token_address.toLowerCase() == shopTokenAddress.toLowerCase()) {
              return userTokens[i];
          }
      }
  }

  return { fetchShopTokenBalance, assets };
};
