import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { injected } from '../Components/Wallet/connectors'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';

export const MetaMaskContext = React.createContext(null)

export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    if (process.env.REACT_APP_CHAINID == 56)
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${Number(process.env.REACT_APP_CHAINID).toString(16)}`,
            chainName: 'Binance Smart Chain Mainnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: [
              process.env.REACT_APP_RPC
            ],
            blockExplorerUrls: ["https://bscscan.com"]
          },
        ],
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}


export const MetaMaskProvider = ({ children }) => {
  const { activate, account, library, connector, active, deactivate, chainId } = useWeb3React()

  const [isActive, setIsActive] = useState(false)
  const [shouldDisable, setShouldDisable] = useState(false) // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true)

  // Init Loading
  useEffect(() => {
    connect().then(val => {
      setIsLoading(false)
    })
  }, [])

  // Check when App is Connected or Disconnected to MetaMask
  const handleIsActive = useCallback(() => {
    console.log('App is connected with MetaMask ', active)
    setIsActive(active)
  }, [active])

  useEffect(() => {
    handleIsActive()
  }, [handleIsActive])

  // Connect to MetaMask wallet
  const connect = async () => {
    console.log('Connecting to MetaMask...')
  
    setShouldDisable(true)
    try {
      await activate(injected, async (error) => {
        if(error instanceof UnsupportedChainIdError){
          const hasSetup = await setupNetwork()
          if (hasSetup) {
            activate(injected).then(() => {
              setShouldDisable(false)
            })
          }
        }
      }
      ).then(() => {
        setShouldDisable(false)
      })
    } catch (error) {
      
      console.log('Error on connecting: ', error)
    }

  }

  // Disconnect from Metamask wallet
  const disconnect = async () => {
    console.log('Disconnecting wallet from App...')
    try {
      await deactivate()
    } catch (error) {
      console.log('Error on disconnnect: ', error)
    }
  }

  const values = useMemo(
    () => ({
      isActive,
      account,
      isLoading,
      connect,
      disconnect,
      shouldDisable
    }),
    [isActive, isLoading, shouldDisable, account]
  )

  return <MetaMaskContext.Provider value={values}>{children}</MetaMaskContext.Provider>
}

export default function useMetaMask() {
  const context = React.useContext(MetaMaskContext)

  if (context === undefined) {
    throw new Error('useMetaMask hook must be used with a MetaMaskProvider component')
  }

  return context
}