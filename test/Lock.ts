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

    const [signer] = await ethers.getSigners();
    const connectedSaveEther = saveEther.connect(signer);

    await connectedSaveEther.deposit({ value: depositAmount });

    const userSavings = await connectedSaveEther.checkSavings(signer.address);
    expect(userSavings).to.equal(depositAmount);
  });

  it("should withdraw Ether", async function () {
    const depositAmount = ethers.parseEther("2");

    const [signer] = await ethers.getSigners();
    const connectedSaveEther = saveEther.connect(signer);

    await connectedSaveEther.deposit({ value: depositAmount });

    await connectedSaveEther.witwhdraw();

    const userSavings = await connectedSaveEther.checkSavings(signer.address);
    expect(userSavings).to.equal(0);
  });
  it("should send Ether to another account", async function () {
    const depositAmount = ethers.parseEther("2");

    const [sender, receiver] = await ethers.getSigners();
    const connectedSaveEther = saveEther.connect(sender);

    await connectedSaveEther.deposit({ value: depositAmount });

    await connectedSaveEther.sendOutEther(receiver.address, depositAmount);

    const senderSavings = await connectedSaveEther.checkSavings(sender.address);
    expect(senderSavings).to.equal(
      0,
      "Sender's savings should be reduced to  0"
    );

    const sendersBalance = await connectedSaveEther.checkSavings(
      sender.address
    );
    expect(sendersBalance).to.equal(senderSavings);
  });
  it("should check contract balance", async function () {
    const [sender] = await ethers.getSigners();
    const connectedSaveEther = saveEther.connect(sender);

    const depositAmount = ethers.parseEther("2");
    await connectedSaveEther.deposit({ value: depositAmount });

    const contractBalance = await connectedSaveEther.checkBalance();

    expect(contractBalance).to.equal(
      depositAmount,
      "Contract balance should match the deposited amount"
    );
  });
});
