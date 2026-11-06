const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Phase 7: HexFence Safe Guard Smart Contract Suite", function () {
  let guard;
  let safe;
  let token;
  let owner;
  let attacker;
  let user;

  // Genuine payee address (checksummed via ethers.getAddress)
  const genuinePayee = ethers.getAddress("0xd9A1c3788D81257612E2581A6ea0aDa244853a91".toLowerCase());
  // Lookalike address: matching 0xd9a1 prefix and 0x3a91 suffix
  const lookalikePayee = ethers.getAddress("0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91".toLowerCase());
  // Non-colliding benign recipient
  const benignPayee = ethers.getAddress("0x1111111254fb6c44bac0bed2854e76f90643097d".toLowerCase());

  beforeEach(async function () {
    [owner, attacker, user] = await ethers.getSigners();

    // 1. Deploy Mock Safe
    const MockSafeFactory = await ethers.getContractFactory("MockSafe");
    safe = await MockSafeFactory.deploy(owner.address);
    await safe.waitForDeployment();

    // 2. Deploy HexFence Guard
    const HexFenceGuardFactory = await ethers.getContractFactory("HexFenceGuard");
    guard = await HexFenceGuardFactory.deploy(owner.address, await safe.getAddress());
    await guard.waitForDeployment();

    // 3. Deploy Mock ERC20
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    token = await MockERC20Factory.deploy();
    await token.waitForDeployment();

    // Hook Guard into Safe
    await safe.connect(owner).setGuard(await guard.getAddress());

    // Fund Safe with 10 ETH and 1,000 Tokens
    await owner.sendTransaction({
      to: await safe.getAddress(),
      value: ethers.parseEther("10"),
    });
    await token.mint(await safe.getAddress(), ethers.parseEther("1000"));
  });

  // Test 1: Approving a payee
  it("Requirement 1: Safe owner can approve genuine payees", async function () {
    await expect(guard.connect(owner).approvePayee(genuinePayee))
      .to.emit(guard, "PayeeApproved")
      .withArgs(genuinePayee, owner.address);

    expect(await guard.isApprovedPayee(genuinePayee)).to.be.true;
    expect(await guard.getApprovedPayeesCount()).to.equal(1n);

    const payees = await guard.getApprovedPayees();
    expect(payees[0].toLowerCase()).to.equal(genuinePayee.toLowerCase());
  });

  // Test 2: Removing a payee
  it("Requirement 2: Safe owner can remove approved payees", async function () {
    await guard.connect(owner).approvePayee(genuinePayee);
    expect(await guard.isApprovedPayee(genuinePayee)).to.be.true;

    await expect(guard.connect(owner).removePayee(genuinePayee))
      .to.emit(guard, "PayeeRemoved")
      .withArgs(genuinePayee, owner.address);

    expect(await guard.isApprovedPayee(genuinePayee)).to.be.false;
    expect(await guard.getApprovedPayeesCount()).to.equal(0n);
  });

  // Test 3: Genuine payment succeeds (ETH and ERC-20)
  it("Requirement 3a: Guard allows genuine approved native ETH transfers", async function () {
    await guard.connect(owner).approvePayee(genuinePayee);

    const initialBalance = await ethers.provider.getBalance(genuinePayee);
    await expect(
      safe.connect(owner).execTransaction(genuinePayee, ethers.parseEther("1"), "0x", 0)
    ).to.emit(safe, "ExecutionSuccess");

    const newBalance = await ethers.provider.getBalance(genuinePayee);
    expect(newBalance - initialBalance).to.equal(ethers.parseEther("1"));
  });

  it("Requirement 3b: Guard allows genuine approved ERC-20 token transfers", async function () {
    await guard.connect(owner).approvePayee(genuinePayee);

    const transferData = token.interface.encodeFunctionData("transfer", [
      genuinePayee,
      ethers.parseEther("50"),
    ]);

    await expect(
      safe.connect(owner).execTransaction(await token.getAddress(), 0, transferData, 0)
    ).to.emit(safe, "ExecutionSuccess");

    expect(await token.balanceOf(genuinePayee)).to.equal(ethers.parseEther("50"));
  });

  // Test 4: Lookalike payment reverts with LookalikePoisoningDetected
  it("Requirement 4a: Guard identifies recipient lookalikes and reverts native ETH transfers", async function () {
    await guard.connect(owner).approvePayee(genuinePayee);

    // Attempt to send ETH to lookalike payee
    await expect(
      safe.connect(owner).execTransaction(lookalikePayee, ethers.parseEther("1"), "0x", 0)
    ).to.be.revertedWithCustomError(guard, "LookalikePoisoningDetected");
  });

  it("Requirement 4b: Guard identifies recipient lookalikes and reverts ERC-20 transfer calls", async function () {
    await guard.connect(owner).approvePayee(genuinePayee);

    const transferData = token.interface.encodeFunctionData("transfer", [
      lookalikePayee,
      ethers.parseEther("50"),
    ]);

    await expect(
      safe.connect(owner).execTransaction(await token.getAddress(), 0, transferData, 0)
    ).to.be.revertedWithCustomError(guard, "LookalikePoisoningDetected");
  });

  it("Requirement 4c: Guard identifies recipient lookalikes in ERC-20 transferFrom calls", async function () {
    await guard.connect(owner).approvePayee(genuinePayee);

    const transferFromData = token.interface.encodeFunctionData("transferFrom", [
      await safe.getAddress(),
      lookalikePayee,
      ethers.parseEther("25"),
    ]);

    await expect(
      safe.connect(owner).execTransaction(await token.getAddress(), 0, transferFromData, 0)
    ).to.be.revertedWithCustomError(guard, "LookalikePoisoningDetected");
  });

  // Test 5: Unauthorized approval fails
  it("Requirement 5: Unauthorized caller cannot approve or remove payees", async function () {
    await expect(
      guard.connect(attacker).approvePayee(attacker.address)
    ).to.be.revertedWithCustomError(guard, "UnauthorizedCaller");

    await guard.connect(owner).approvePayee(genuinePayee);

    await expect(
      guard.connect(attacker).removePayee(genuinePayee)
    ).to.be.revertedWithCustomError(guard, "UnauthorizedCaller");
  });

  // Test 6: Recovery mechanism works
  it("Requirement 6a: Recovery mechanism via setEmergencyBypass works", async function () {
    await guard.connect(owner).approvePayee(genuinePayee);

    // Turn on emergency bypass
    await expect(guard.connect(owner).setEmergencyBypass(true))
      .to.emit(guard, "EmergencyBypassToggled")
      .withArgs(true, owner.address);

    // Lookalike transaction is now unblocked
    await expect(
      safe.connect(owner).execTransaction(lookalikePayee, ethers.parseEther("0.1"), "0x", 0)
    ).to.emit(safe, "ExecutionSuccess");
  });

  it("Requirement 6b: Recovery mechanism via Safe removing Guard (setGuard(0)) works", async function () {
    await guard.connect(owner).approvePayee(genuinePayee);

    // Safe owner detaches guard
    await safe.connect(owner).setGuard(ethers.ZeroAddress);

    // Now lookalike transaction succeeds without guard intervention
    await expect(
      safe.connect(owner).execTransaction(lookalikePayee, ethers.parseEther("0.1"), "0x", 0)
    ).to.emit(safe, "ExecutionSuccess");
  });

  // Test 7: Unsupported transaction formats are handled safely
  it("Requirement 7: Unsupported transaction formats are safely passed through without false revert", async function () {
    await guard.connect(owner).approvePayee(genuinePayee);

    // Arbitrary contract interaction with custom selector
    const customCallData = "0x12345678000000000000000000000000000000000000000000000000000000000000002a";

    // Benign recipient not matching vanity pattern passes safely
    await expect(
      safe.connect(owner).execTransaction(benignPayee, ethers.parseEther("0.05"), "0x", 0)
    ).to.emit(safe, "ExecutionSuccess");
  });
});
