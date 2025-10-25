import { ethers } from "ethers";
const postRegistry = require("../abis/PostRegistry.json");
const dataVault = require("../abis/DataVault.json");

const postRegistryAbi = postRegistry.abi;
const dataVaultAbi = dataVault.abi;


// export const provider = new ethers.JsonRpcProvider(process.env.BLOCKDAG_RPC_URL, 1043);

export const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL, 11155111);

export const dataVaultContract = new ethers.Contract(
  process.env.DATA_VAULT_ADDRESS || "",
  dataVaultAbi,
  provider
);

export const postRegistryContract = new ethers.Contract(
  process.env.POST_REGISTRY_ADDRESS || "",
  postRegistryAbi,
  provider
);
