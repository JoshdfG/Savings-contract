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

  it("should send Ether to another account", async function () {
    const depositAmount = ethers.parseEther("2");

    // Connect to the contract using two signers
    const [sender, receiver] = await ethers.getSigners();
    const connectedSaveEther = saveEther.connect(sender);

    // Deposit Ether
    await connectedSaveEther.deposit({ value: depositAmount });

    // Send Ether to another account
    await connectedSaveEther.sendOutEther(receiver.address, depositAmount);

    // Check sender's savings
    const senderSavings = await connectedSaveEther.checkSavings(sender.address);
    expect(senderSavings).to.equal(
      0,
      "Sender's savings should be reduced to  0"
    );

    //Check sender's savings
    const sendersBalance = await connectedSaveEther.checkSavings(
      sender.address
    );
    expect(sendersBalance).to.equal(senderSavings);
  });

  it("should check contract balance", async function () {
    const [sender] = await ethers.getSigners();
    const connectedSaveEther = saveEther.connect(sender);

    // Deposit some Ether to the contract
    const depositAmount = ethers.parseEther("2");
    await connectedSaveEther.deposit({ value: depositAmount });

    // Check contract balance
    const contractBalance = await connectedSaveEther.checkBalance();

    // Expected balance should be the deposited amount
    expect(contractBalance).to.equal(
      depositAmount,
      "Contract balance should match the deposited amount"
    );
  });
});
