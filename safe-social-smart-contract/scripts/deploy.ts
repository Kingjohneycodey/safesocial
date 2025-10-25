import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BDAG");

  // Deploy DataVault first
  const DataVault = await ethers.getContractFactory("DataVault");
  const dataVault = await DataVault.deploy();
  await dataVault.waitForDeployment();
  const dataVaultAddress = await dataVault.getAddress();
  console.log("DataVault deployed to:", dataVaultAddress);

  // Deploy PostRegistry with DataVault's address
  const PostRegistry = await ethers.getContractFactory("PostRegistry");
  const postRegistry = await PostRegistry.deploy(dataVaultAddress);
  await postRegistry.waitForDeployment();
  const postRegistryAddress = await postRegistry.getAddress();
  console.log("PostRegistry deployed to:", postRegistryAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
