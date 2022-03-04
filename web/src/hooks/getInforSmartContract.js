import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import { Contract, Provider, setMulticallAddress } from 'ethers-multicall';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import LotteryAbi from '../config/abi/Lottery.json';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC);
const ADDRESS_LOTTERY = process.env.REACT_APP_ADDRESS_LOTTERY;

setMulticallAddress(process.env.REACT_APP_CHAINID,  process.env.REACT_APP_ADDRESS_MULTICAL)

export async function getBalance(account) {
    window.web3 = new Web3(window.ethereum);
    const { eth, utils } = window.web3;
    var balance = await eth.getBalance(account);
    balance = utils.fromWei(String(balance), 'ether');
    console.log(balance, "balance") 

    return balance;
}

export async function getPoolInfor() {
    window.web3 = new Web3(window.ethereum);
    const { eth, utils } = window.web3;
    let LotteryContract = new  eth.Contract(LotteryAbi, ADDRESS_LOTTERY);
    const dataPool = await LotteryContract.methods.getInforPoolCurrent().call();
    return dataPool;
}

export async function buyTicket(account) {
    window.web3 = new Web3(window.ethereum);
    const { eth, utils } = window.web3;
    let LotteryContract = new  eth.Contract(LotteryAbi, ADDRESS_LOTTERY);
    const dataPool = await LotteryContract.methods.getInforPoolCurrent().call();

    console.log("dataPool", dataPool)
    
    await LotteryContract.methods
        .buyTicket()
        .send({ from: account, value: dataPool.priceTicket })
        .on('confirmation', () => {

        })
        .then(function(receipt){
            
        });

    return true;
}

export async function historyPoolLottery() {
    window.web3 = new Web3(window.ethereum);
    const { eth, utils } = window.web3;
    let LotteryContract = new  eth.Contract(LotteryAbi, ADDRESS_LOTTERY);
    const dataPool = await LotteryContract.methods.getInforPoolCurrent().call();

    let dataHistory = await getHistory(Number(dataPool.id));

    const reponse = []
    var i,j, temporary, chunk = 5;
    for (i = 0,j = dataHistory.length; i < j; i += chunk) {
        temporary = dataHistory.slice(i, i + chunk);
        let data = {
            id: dataPool.id,
            priceTicket: utils.fromWei(String(temporary[0]), 'ether'),
            blockNumberEnd: Number(temporary[1]),
            winner: String(temporary[2]),
            isDone: temporary[3],
            amountPool: utils.fromWei(String(temporary[4]), 'ether') 
        }
        reponse.push(data)
    }

    return reponse;
}


async function getHistory(idPoolCurrent) {
    const ethcallProvider = new Provider(provider);
    await ethcallProvider.init();
    
    const LotteryContract = new Contract(
        ADDRESS_LOTTERY,
        LotteryAbi,
    )

    const contractCalls = []
    for (let i = idPoolCurrent; i > 0; i--){
        contractCalls.push(LotteryContract.getPrizeOfPool(i))
        contractCalls.push(LotteryContract.getBlockEndOfPool(i))
        contractCalls.push(LotteryContract.getWinnerOfPool(i))    
        contractCalls.push(LotteryContract.getStatusOfPool(i))    
        contractCalls.push(LotteryContract.getInforAmountTokenOfPool(i))    
    }
    const results = await ethcallProvider.all(contractCalls);
    return results
}
