import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import useMetaMask from '../../hooks/metamask';

function ButtonConnectMetamask() {
  
  const { connect, disconnect, isActive, account, shouldDisable } = useMetaMask()


  return (
    <div className="App">
      <header className="App-header">
        {!isActive && (
          <Button variant="secondary" onClick={connect} disabled={shouldDisable}>
            <img src="images/metamask.svg" alt="MetaMask" width="50" height="50" /> Connect to MetaMask
          </Button>
        )}
        {isActive && (
          <div style={{display:"flex"}}>
            <div className="mt-2 mb-2" style={{color:"#FFF", textOverflow: "ellipsis", overflow: "hidden", width: "100px", }}>
              { isActive ? account : '' }
            </div>
            <Button variant="danger" onClick={disconnect}>
              Disconnect MetaMask
            </Button>
          </div>
        )}
      </header>
    </div>
  );
}

export default ButtonConnectMetamask;