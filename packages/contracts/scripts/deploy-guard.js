const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("==================================================");
  console.log("HexFence Safe Guard Sepolia Deployment");
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("==================================================");

  // Default target Safe account on Sepolia (or deployer as owner if standalone)
  const safeAccount = process.env.SEPOLIA_SAFE_ADDRESS || deployer.address;
  const ownerAddress = process.env.GUARD_OWNER_ADDRESS || deployer.address;

  console.log("Deploying HexFenceGuard...");
  console.log("Configured Owner:", ownerAddress);
  console.log("Linked Safe:", safeAccount);

  const HexFenceGuard = await ethers.getContractFactory("HexFenceGuard");
  const guard = await HexFenceGuard.deploy(ownerAddress, safeAccount);
  await guard.waitForDeployment();

  const guardAddress = await guard.getAddress();
  console.log("✅ HexFenceGuard deployed successfully to:", guardAddress);
  console.log("Etherscan URL: https://sepolia.etherscan.io/address/" + guardAddress);
  console.log("");
  console.log("To connect to your Gnosis Safe on Sepolia:");
  console.log(`1. Call safe.setGuard("${guardAddress}") from Safe owners`);
  console.log(`2. Approve genuine payees via guard.approvePayee(genuinePayeeAddress)`);
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

