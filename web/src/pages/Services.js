import React,  {useState, useEffect, useCallback} from "react";
import { useTranslation } from "react-i18next";
import useMetaMask from "../hooks/metamask";
import { getBalanceERC20, buyTicket } from "../hooks/getInforSmartContract";
import { useWeb3React } from '@web3-react/core';
import { Button } from "react-bootstrap";

const Lottery = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(false)
  const { activate, account, library, connector, active, deactivate, chainId } = useWeb3React()



  useEffect(() => {
    async function test() {
      const dataTest = await getBalanceERC20(account);
      setData(dataTest)
    }
    test();
  }, [data]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <h1>{t("Lottery")}</h1>
      <Button onClick={async () => { await buyTicket(account)}}> Test </Button>
    </div>
  );
};

export default Lottery;
