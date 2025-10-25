import DataVaultAbi from '../../abis/DataVault.json';
import PostRegistryAbi from '../../abis/PostRegistry.json';
import { uploadToPinataDirect } from "./upload-to-pinata";
import { ethers } from "ethers";

export async function createPostApi({
  file,
  description,
  price,
  isPublic,
  pinataJWT,
  pinataGateway,
}: {
  file: File;
  description: string;
  price: string;
  isPublic: boolean;
  pinataJWT: string;
  pinataGateway?: string;
}) {
  const pinataUpload = await uploadToPinataDirect(file, pinataJWT, pinataGateway);
  if (!pinataUpload.success) throw new Error(pinataUpload.error);
  const { cid } = pinataUpload;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/onchain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ description, price, isPublic, cid, fileName: file.name }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Could not create post.");
  }
  return res.json();
}

export async function createPostOnchainWithUser({
  file,
  description,
  price,
  isPublic,
  pinataJWT,
  pinataGateway,
  dataVaultAddress,
  postRegistryAddress,
  signer,
}: {
  file: File;
  description: string;
  price: string;
  isPublic: boolean;
  pinataJWT: string;
  pinataGateway?: string;
  dataVaultAddress: string;
  postRegistryAddress: string;
  signer: ethers.Signer;
}) {
  // 1. Upload file to Pinata
  const pinataUpload = await uploadToPinataDirect(file, pinataJWT, pinataGateway);
  if (!pinataUpload.success) throw new Error(pinataUpload.error);
  const { cid } = pinataUpload;
  // 2. Call smart contracts on-chain using user's signer
  const fileId = ethers.keccak256(ethers.toUtf8Bytes(cid + file.name));
  const dataVault = new ethers.Contract(dataVaultAddress, DataVaultAbi.abi, signer);
  const postRegistry = new ethers.Contract(postRegistryAddress, PostRegistryAbi.abi, signer);
  // Register file and then create post
  const tx1 = await dataVault.registerFile(fileId, cid, "");
  await tx1.wait();
  
  // Convert price to wei if it's not already 0
  const priceInWei = price === "0" ? "0" : ethers.parseEther(price.toString());
  console.log('💰 Price conversion:', { original: price, converted: priceInWei.toString() });
  
  const tx2 = await postRegistry.createPost(fileId, description, priceInWei, isPublic);
  await tx2.wait();
  return { fileId, cid, tx1, tx2 };
}
