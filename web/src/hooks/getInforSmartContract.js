import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import ERC20Abi from '../config/abi/IERC20.json';
import LotteryAbi from '../config/abi/Lottery.json';
import { ethers } from 'ethers';
const ADDRESS_ERC20 = process.env.REACT_APP_ADDRESS_ERC20;
const ADDRESS_LOTTERY = process.env.REACT_APP_ADDRESS_LOTTERY;

export async function getBalanceERC20(account) {
    console.log(account, ADDRESS_ERC20)
    window.web3 = new Web3(window.ethereum);
    const { eth, utils } = window.web3;
    let testContract = new  eth.Contract(ERC20Abi, ADDRESS_ERC20);
    const temp = await testContract.methods.balanceOf(account).call()
    let response = utils.fromWei(String(temp), 'ether')
    console.log(response, "response") 
    return true;
}

export async function buyTicket(account) {
    console.log(account, ADDRESS_LOTTERY)
    window.web3 = new Web3(window.ethereum);
    const { eth, utils } = window.web3;
    let LotteryContract = new  eth.Contract(LotteryAbi, ADDRESS_LOTTERY);

    // let approve_amount =
    //     '115792089237316195423570985008687907853269984665640564039457584007913129639935'; //(2^256 - 1 )

    await LotteryContract.methods
        .buyTicket()
        .send({ from: account, value: ethers.utils.parseEther("0.2") })
        .on('confirmation', () => {
            // setListPackage(listPackage.map((item, i) => item.id === selectedPackage.id ? ({ ...item, isEnable: true }) : item))
        });

    return true;
}
