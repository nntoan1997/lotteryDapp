import React,  {useState, useEffect, useCallback} from "react";
import { useTranslation } from "react-i18next";
import useMetaMask from "../hooks/metamask";
import { getBalance, getPoolInfor, buyTicket, historyPoolLottery } from "../hooks/getInforSmartContract";
import { useWeb3React } from '@web3-react/core';
import { Button } from "react-bootstrap";

const Lottery = () => {
  const { t } = useTranslation();
  const [ethBalance, setEthBalance] = useState()
  const [render, setRender] = useState(true)
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
    if(!render) {
      setTimeout(() => {
        getInfor();
      }, 5000);
    } else {
      getInfor();
      setRender(false)
    }
    

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
          <table style={{"width":"100%"}}>  
            <tr>
              <th>{t("poolId")}</th>
              <th>{t("poolPriceTicket")}</th>
              <th>{t("poolBlockEnd")}</th>
              <th>{t("poolWinner")}</th>
              <th>{t("amountPool")}</th>
            </tr>        
            {historyPool.map((pool)=> (
            <>
              <tr>
                <td>{pool?.id}</td>
                <td>{pool?.priceTicket}</td>
                <td>{pool?.blockNumberEnd}</td>
                <td>{pool?.winner}</td>
                <td>{pool?.amountPool}</td>
              </tr>               
            </>
          ))}
        </table>
        )}
        
        
      </div>
    </div>
    
  );
};

export default Lottery;
