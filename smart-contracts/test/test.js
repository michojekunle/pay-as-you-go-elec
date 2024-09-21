const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PayAsYouGoElectricity", function () {
  let payAsYouGo;
  let owner, user, meter, nonOwner;

  beforeEach(async function () {
    // Get the contract factory and signers
    const PayAsYouGoElectricity = await ethers.getContractFactory("PayAsYouGoElectricity");
    [owner, user, meter, nonOwner] = await ethers.getSigners();

    // Deploy the contract
    payAsYouGo = await PayAsYouGoElectricity.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await payAsYouGo.owner()).to.equal(owner);
    });
  });

  describe("User Registration", function () {
    it("Should allow the owner to register a user", async function () {
      await payAsYouGo.connect(owner).registerUser(user);
      const userInfo = await payAsYouGo.users(user);
      expect(userInfo.isRegistered).to.be.true;
    });

    it("Should revert if a user is already registered", async function () {
      await payAsYouGo.connect(owner).registerUser(user.address);
      await expect(payAsYouGo.connect(owner).registerUser(user.address)).to.be.revertedWithCustomError(
        payAsYouGo,
        "AlreadyRegistered"
      );
    });

    it("Should not allow non-owner to register users", async function () {
      await expect(payAsYouGo.connect(nonOwner).registerUser(user.address)).to.be.revertedWithCustomError(
        payAsYouGo,
        "Unauthorized"
      );
    });
  });

  describe("Meter Registration", function () {
    it("Should allow the owner to register a meter", async function () {
      await payAsYouGo.connect(owner).registerMeter(meter.address);
      const isMeterRegistered = await payAsYouGo.registeredMeters(meter.address);
      expect(isMeterRegistered).to.be.true;
    });

    it("Should revert if a meter is already registered", async function () {
      await payAsYouGo.connect(owner).registerMeter(meter.address);
      await expect(payAsYouGo.connect(owner).registerMeter(meter.address)).to.be.revertedWithCustomError(
        payAsYouGo,
        "AlreadyRegistered"
      );
    });

    it("Should not allow non-owner to register meters", async function () {
      await expect(payAsYouGo.connect(nonOwner).registerMeter(meter.address)).to.be.revertedWithCustomError(
        payAsYouGo,
        "Unauthorized"
      );
    });
  });

  describe("Top-Up", function () {
    beforeEach(async function () {
      await payAsYouGo.connect(owner).registerUser(user.address);
    });

    it("Should allow a registered user to top up electricity credits", async function () {
      const topUpAmount = ethers.parseEther("1.0");
      await expect(payAsYouGo.connect(user).topUp({ value: topUpAmount }))
        .to.emit(payAsYouGo, "TopUp")
        .withArgs(user.address, topUpAmount);
      const userInfo = await payAsYouGo.users(user.address);
      expect(userInfo.balance).to.equal(topUpAmount);
    });

    it("Should revert if top-up amount is zero", async function () {
      await expect(payAsYouGo.connect(user).topUp({ value: 0 })).to.be.revertedWithCustomError(
        payAsYouGo,
        "InvalidAmount"
      );
    });

    it("Should revert if an unregistered user tries to top up", async function () {
      await expect(payAsYouGo.connect(nonOwner).topUp({ value: ethers.parseEther("1.0") })).to.be.revertedWithCustomError(
        payAsYouGo,
        "Unauthorized"
      );
    });
  });

  describe("Use Electricity", function () {
    beforeEach(async function () {
      await payAsYouGo.connect(owner).registerUser(user.address);
      await payAsYouGo.connect(owner).registerMeter(meter.address);
      await payAsYouGo.connect(user).topUp({ value: ethers.parseEther("1.0") });
    });

    it("Should allow a registered meter to deduct user's electricity credits", async function () {
      const deductAmount = ethers.parseEther("0.5");
      await expect(payAsYouGo.connect(meter).useElectricity(user.address, deductAmount))
        .to.emit(payAsYouGo, "ElectricityUsed")
        .withArgs(user.address, deductAmount);
      const userInfo = await payAsYouGo.users(user.address);
      expect(userInfo.balance).to.equal(ethers.parseEther("0.5"));
    });

    it("Should revert if the user's balance is insufficient", async function () {
      const deductAmount = ethers.parseEther("2.0");
      await expect(payAsYouGo.connect(meter).useElectricity(user.address, deductAmount)).to.be.revertedWithCustomError(
        payAsYouGo,
        "InsufficientBalance"
      );
    });

    it("Should revert if an unregistered meter tries to use electricity", async function () {
      await expect(payAsYouGo.connect(nonOwner).useElectricity(user.address, ethers.parseEther("0.5"))).to.be.revertedWithCustomError(
        payAsYouGo,
        "MeterNotRegistered"
      );
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      await payAsYouGo.connect(owner).registerUser(user.address);
      await payAsYouGo.connect(user).topUp({ value: ethers.parseEther("1.0") });
    });

    it("Should allow the owner to withdraw funds", async function () {
      const ownerBalanceBefore = await ethers.provider.getBalance(owner);
    
      const tx = await payAsYouGo.connect(owner).withdraw();
      const receipt = await tx.wait();
    
      // Convert gasUsed to BigNumber
      const gasUsed = ethers.BigNumber.from(receipt.gasUsed);
      const effectiveGasPrice = ethers.BigNumber.from(receipt.effectiveGasPrice);
      const totalGasCost = gasUsed.mul(effectiveGasPrice);
    
      const contractBalance = await ethers.provider.getBalance(payAsYouGo.address);
    
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    
      // Check that the owner's balance increased by the contract's balance minus the gas cost
      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(contractBalance).sub(totalGasCost));
    });
    

    it("Should revert if a non-owner tries to withdraw", async function () {
      await expect(payAsYouGo.connect(nonOwner).withdraw()).to.be.revertedWithCustomError(
        payAsYouGo,
        "Unauthorized"
      );
    });
  });
});
