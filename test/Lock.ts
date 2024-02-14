/// <reference types="ethers" />
import { ethers } from "hardhat";
import { expect } from "chai";
import { SaveEther } from "../typechain-types";

describe("SaveEther Contract", function () {
  let saveEther: SaveEther;

  beforeEach(async () => {
    const SaveEther = await ethers.getContractFactory("SaveEther");
    saveEther = await SaveEther.deploy();
  });

  it("should deposit Ether", async function () {
    const depositAmount = ethers.parseEther("1");

    // Connect to the contract using the signer
    const [signer] = await ethers.getSigners();
    const connectedSaveEther = saveEther.connect(signer);

    // Deposit Ether
    await connectedSaveEther.deposit({ value: depositAmount });

    // Check user savings
    const userSavings = await connectedSaveEther.checkSavings(signer.address);
    expect(userSavings).to.equal(depositAmount);
  });

  it("should withdraw Ether", async function () {
    const depositAmount = ethers.parseEther("2");

    // Connect to the contract using the signer
    const [signer] = await ethers.getSigners();
    const connectedSaveEther = saveEther.connect(signer);

    // Deposit Ether
    await connectedSaveEther.deposit({ value: depositAmount });

    // Withdraw Ether
    await connectedSaveEther.witwhdraw();

    // Check user savings
    const userSavings = await connectedSaveEther.checkSavings(signer.address);
    expect(userSavings).to.equal(0);
  });
});
