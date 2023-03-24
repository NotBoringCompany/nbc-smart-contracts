const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("KeyOfSalvation", async () => {
  const deployment = async () => {
    const KOS = await ethers.getContractFactory('KeyOfSalvation');
    const kos = await KOS.deploy(500, '', '');

    return kos;
  }

  describe("Deployment", async () => {
    it("Should deploy the contract", async () => {
      const kos = await deployment();
      expect(kos.address).to.not.be.empty;
      console.log(kos.address);
    });
  });
})

