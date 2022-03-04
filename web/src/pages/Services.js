import React,  {useState, useEffect, useCallback} from "react";
import { useTranslation } from "react-i18next";
import useMetaMask from "../hooks/metamask";
import { getBalance, getPoolInfor, buyTicket, historyPoolLottery } from "../hooks/getInforSmartContract";
import { useWeb3React } from '@web3-react/core';
import { Button } from "react-bootstrap";

const Lottery = () => {
  const { t } = useTranslation();
  const [ethBalance, setEthBalance] = useState()
  const [poolInfor, setPoolInfor] = useState()
  const [historyPool, setHistoryPool] = useState([])
  const { activate, account, library, connector, active, deactivate, chainId } = useWeb3React()

  useEffect(() => {
    async function getInfor() {
      const balance = await getBalance(account);
      setEthBalance(balance);
      const historyData = await historyPoolLottery();
      setHistoryPool(historyData);
      setPoolInfor(historyData[0]);
    }
    getInfor();

  }, [ethBalance, poolInfor, historyPool]);

  return (
    <div>
      <h1>{t("Lottery")}</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10vh",
        }}
      >
        <h1>{t("Balance of User")} : {ethBalance}</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10vh",
        }}
      >
        <Button onClick={async () => { await buyTicket(account)}}> 
          Buy Tickket
        </Button>
      </div>
      <h1>{t("poolData")}</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10vh",
        }}
      >
        {poolInfor && (
          <>          
          {historyPool.map((pool)=> (
            <>
              <h1 style={{textOverflow: "ellipsis", overflow: "hidden", width: "20%"}}>{t("poolId")}: {pool?.id}</h1>
              <h1 style={{textOverflow: "ellipsis", overflow: "hidden", width: "20%"}}>{t("poolPriceTicket")} : {pool?.priceTicket}</h1>
              <h1 style={{textOverflow: "ellipsis", overflow: "hidden", width: "20%"}}>{t("poolBlockEnd")} : {pool?.blockNumberEnd}</h1>
              <h1 style={{textOverflow: "ellipsis", overflow: "hidden", width: "20%"}}>{t("poolWinner")} : {pool?.winner}</h1>
              <h1 style={{textOverflow: "ellipsis", overflow: "hidden", width: "20%"}}>{t("amountPool")} : {pool?.amountPool}</h1>
            </>
          ))}
        </>
        )}
        
        
      </div>
    </div>
    
  );
};

export default Lottery;
