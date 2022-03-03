import "@nomiclabs/hardhat-waffle";
import { ethers } from 'hardhat';
import { expect, use, util } from 'chai';
import { solidity } from 'ethereum-waffle';

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import { BlockhashStore } from "typechain/BlockhashStore";
import { LinkToken } from "typechain/LinkToken";
import { VRFCoordinator } from "typechain/VRFCoordinator";
import { RandomNumberGenerator } from "typechain/RandomNumberGenerator";
import { CakeToken } from "typechain/CakeToken";
import { PancakeSwapLottery } from "typechain/PancakeSwapLottery";

import { base58 } from "ethers/lib/utils";
use(solidity);

const price = 1000

describe('Marketplace ', () => {
  let BlockhashStoreInstance: BlockhashStore
  let LinkTokenInstance: LinkToken
  let VRFCoordinatorInstance: VRFCoordinator
  let RandomNumberGeneratorInstance: RandomNumberGenerator
  let CakeTokenInstance: CakeToken
  let PancakeSwapLotteryInstance: PancakeSwapLottery

  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress
  let addressFee: SignerWithAddress
  let exchanger: SignerWithAddress

  beforeEach(async () => {
    [owner, addr1, addr2, exchanger, addressFee] = await ethers.getSigners();
    const BlockhashStoreContract= await ethers.getContractFactory("BlockhashStore")
    BlockhashStoreInstance = (await BlockhashStoreContract.deploy()) as BlockhashStore
    await BlockhashStoreInstance.deployed();

    const LinkTokenContract= await ethers.getContractFactory("LinkToken")
    LinkTokenInstance = (await LinkTokenContract.deploy()) as LinkToken
    await LinkTokenInstance.deployed();

    const VRFCoordinatorContract= await ethers.getContractFactory("VRFCoordinator")
    VRFCoordinatorInstance = (await VRFCoordinatorContract.deploy(LinkTokenInstance.address, BlockhashStoreInstance.address)) as VRFCoordinator
    await VRFCoordinatorInstance.deployed();

    const RandomNumberGeneratorContract= await ethers.getContractFactory("RandomNumberGenerator")
    RandomNumberGeneratorInstance = (await RandomNumberGeneratorContract.deploy(VRFCoordinatorInstance.address, LinkTokenInstance.address) as RandomNumberGenerator)
    await RandomNumberGeneratorInstance.deployed();

    const CakeTokenContract= await ethers.getContractFactory("CakeToken")
    CakeTokenInstance = (await CakeTokenContract.deploy() as CakeToken)
    await CakeTokenInstance.deployed();

    const PancakeSwapLotteryContract= await ethers.getContractFactory("PancakeSwapLottery")
    PancakeSwapLotteryInstance = (await PancakeSwapLotteryContract.deploy(CakeTokenInstance.address, RandomNumberGeneratorInstance.address) as PancakeSwapLottery)
    await PancakeSwapLotteryInstance.deployed();

  });
  describe('test farming pool', () => {
    beforeEach("create data ", async () => {
        CakeTokenInstance["mint(address,uint256)"](PancakeSwapLotteryInstance.address, ethers.utils.parseEther("10000"));
        PancakeSwapLotteryInstance.maxPriceTicketInCake();
        
    });

    it("create stake ", async () => {

    });
  })
})
