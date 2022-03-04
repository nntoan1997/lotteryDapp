import "@nomiclabs/hardhat-waffle";
import { ethers  } from 'hardhat';
import { expect, use, util } from 'chai';
import { BigNumberish, PayableOverrides, utils, ContractTransaction } from 'ethers'
import { solidity } from 'ethereum-waffle';

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { Lottery } from "typechain/Lottery";

import { base58 } from "ethers/lib/utils";
use(solidity);

export const usedGasEther = async (res: ContractTransaction): Promise<BigNumberish> => {
  const usedGas = (await res.wait(0)).cumulativeGasUsed

  return new Promise((resolve, reject) => {
    resolve(usedGas.mul(res.gasPrice));
  });
}

const price = ethers.utils.parseEther("0.2")
const priceBigger = ethers.utils.parseEther("0.3")
const priceSmaller = ethers.utils.parseEther("0.1")
const currentBlock1 = ethers.provider.blockNumber + 100;
const currentBlock2 = ethers.provider.blockNumber + 200;
const currentBlock3 = ethers.provider.blockNumber + 300;
const currentBlock4 = ethers.provider.blockNumber + 400;

async function mineNBlocks(n) {
  const minute = 3600
  for (let index = 0; index < n; index++) {
    await ethers.provider.send('evm_increaseTime', [minute]);
    await ethers.provider.send('evm_mine', []);
  }
}

describe('lottery ', () => {
  let LotteryInstance: Lottery

  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress
  let addr3: SignerWithAddress
  let addr4: SignerWithAddress

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    const LotteryContract= await ethers.getContractFactory("Lottery")
    LotteryInstance = (await LotteryContract.deploy()) as Lottery
    await LotteryInstance.deployed();

  });
  describe('test lottery', () => {
    beforeEach("init pool ", async () => {
      await LotteryInstance.generatePoolLottery(price, currentBlock1);
      await expect(LotteryInstance.generatePoolLottery(price, currentBlock1)).to.be.revertedWith("poolData is not expires");
    });

    it("buy tickket ", async () => {
        const balanceAdd1ETHBefore = await ethers.provider.getBalance(addr1.address);
        const balanceAdd2ETHBefore = await ethers.provider.getBalance(addr2.address);

        await expect(LotteryInstance.connect(addr1).buyTicket({
          value: priceBigger
        })).to.be.revertedWith("price must samge price ticket");

        await expect(LotteryInstance.connect(addr1).buyTicket({
          value: priceSmaller
        })).to.be.revertedWith("price must samge price ticket")

       
        const tx2 = await LotteryInstance.connect(addr2).buyTicket({
          value: price
        })
        const tx3 = await LotteryInstance.connect(addr2).buyTicket({
          value: price
        })

        const costTx2 = await usedGasEther(tx2);
        const costTx3 = await usedGasEther(tx3);
        const balanceAdd2ETHAfter = await ethers.provider.getBalance(addr2.address);

        expect(balanceAdd2ETHBefore).to.be.equal(balanceAdd2ETHAfter.add(price).add(price).add(costTx2).add(costTx3))
    });

    it("pick winner ", async () => {
      await LotteryInstance.connect(addr1).buyTicket({
        value: price
      })  
      await LotteryInstance.connect(addr2).buyTicket({
        value: price
      })
      await LotteryInstance.connect(addr2).buyTicket({
        value: price
      })
      await LotteryInstance.connect(addr3).buyTicket({
        value: price
      })  
      await LotteryInstance.connect(addr4).buyTicket({
        value: price
      })
      await LotteryInstance.connect(addr4).buyTicket({
        value: price
      })

      await expect(LotteryInstance.connect(addr4).pickWinner()).to.be.revertedWith("Ownable: caller is not the owner");
      await expect(LotteryInstance.connect(owner).pickWinner()).to.be.revertedWith("poolData is not expires");
      await mineNBlocks(300);

      await LotteryInstance.connect(owner).pickWinner();
      await expect(LotteryInstance.connect(owner).pickWinner()).to.be.revertedWith("poolData is done");
    });
  })
})
