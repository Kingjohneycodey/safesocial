import { expect } from "chai";
import { ethers } from "hardhat";

describe("DataVault", function () {
  let DataVault: any, dataVault: any, owner: any, alice: any, bob: any;

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    DataVault = await ethers.getContractFactory("DataVault");
    dataVault = await DataVault.deploy();
    await dataVault.waitForDeployment();
  });

  it("registers a file and emits event", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("file1"));
    const tx = await dataVault.connect(owner).registerFile(fileId, "ipfs1", "meta1");
    await expect(tx)
      .to.emit(dataVault, "FileRegistered")
      .withArgs(fileId, owner.address, "ipfs1", "meta1");
  });

  it("grants, revokes access and emits correct events", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("fileA"));
    await dataVault.connect(owner).registerFile(fileId, "ipfsA", "metaA");
    const tx = await dataVault.connect(owner).grantAccess(fileId, alice.address, "keyA");
    await expect(tx)
      .to.emit(dataVault, "AccessGranted")
      .withArgs(fileId, alice.address, "keyA");
    expect(await dataVault.checkAccess(fileId, alice.address)).to.equal(true);
    const tx2 = await dataVault.connect(owner).revokeAccess(fileId, alice.address);
    await expect(tx2)
      .to.emit(dataVault, "AccessRevoked")
      .withArgs(fileId, alice.address);
    expect(await dataVault.checkAccess(fileId, alice.address)).to.equal(false);
  });

  it("restricts access grant to owner only", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("fileB"));
    await dataVault.connect(owner).registerFile(fileId, "ipfsB", "metaB");
    await expect(
      dataVault.connect(alice).grantAccess(fileId, bob.address, "failkey")
    ).to.be.revertedWith("Not owner");
  });

  it("returns file hash only if permitted", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("s3curefile"));
    await dataVault.connect(owner).registerFile(fileId, "ipfsSecret", "metaData");
    await dataVault.connect(owner).grantAccess(fileId, alice.address, "encKey");
    // alice can get file
    await expect(dataVault.connect(alice).getFile(fileId))
      .to.emit(dataVault, "Accessed")
      .withArgs(fileId, alice.address, anyUint());
    // bob can't
    await expect(dataVault.connect(bob).getFile(fileId)).to.be.revertedWith("Access denied");
  });

  it("logs access and retrieves history", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("logfile"));
    await dataVault.connect(owner).registerFile(fileId, "ipfsLog", "metaLog");
    await dataVault.connect(owner).grantAccess(fileId, alice.address, "logkey");
    await dataVault.connect(alice).getFile(fileId);
    await dataVault.connect(alice).getFile(fileId);
    expect(await dataVault.getAccessHistoryLength(fileId)).to.equal(2);
    const [addresses, timestamps] = await dataVault.getAccessHistory(fileId, 0, 2);
    expect(addresses[0]).to.equal(alice.address);
  });

  it("returns encryptedKey for allowed users", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("ekeyfile"));
    await dataVault.connect(owner).registerFile(fileId, "ipfsKEY", "metaK");
    await dataVault.connect(owner).grantAccess(fileId, alice.address, "EKEY1");
    expect(await dataVault.connect(alice).getEncryptedKey(fileId, alice.address)).to.equal("EKEY1");
    await expect(dataVault.connect(bob).getEncryptedKey(fileId, bob.address)).to.be.revertedWith("Access denied");
  });

  it("only allows file registration once for a fileId", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("unique"));
    await dataVault.connect(owner).registerFile(fileId, "ipfsUNIQ", "metaUNI");
    await expect(dataVault.connect(owner).registerFile(fileId, "again", "fail")).to.be.revertedWith("File already exists");
  });

  it("revokes access, and user cannot access file after", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("secretfile"));
    await dataVault.connect(owner).registerFile(fileId, "ipfssecret", "metaS");
    await dataVault.connect(owner).grantAccess(fileId, alice.address, "AKEY");
    await dataVault.connect(owner).revokeAccess(fileId, alice.address);
    await expect(dataVault.connect(alice).getFile(fileId)).to.be.revertedWith("Access denied");
    await expect(dataVault.connect(alice).getEncryptedKey(fileId, alice.address)).to.be.revertedWith("Access denied");
  });

  it("only allows owner to revoke access", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("ownrev"));
    await dataVault.connect(owner).registerFile(fileId, "ipfsown", "metaO");
    await dataVault.connect(owner).grantAccess(fileId, alice.address, "OK");
    await expect(dataVault.connect(alice).revokeAccess(fileId, alice.address)).to.be.revertedWith("Not owner");
  });

  it("can handle many access grants for file", async () => {
    const fileId = ethers.keccak256(ethers.toUtf8Bytes("massgrants"));
    await dataVault.connect(owner).registerFile(fileId, "ipfsmany", "many");
    for(let i=0; i<20; i++) {
      await dataVault.connect(owner).grantAccess(fileId, ethers.Wallet.createRandom().address, "KEY"+i);
    }
    // (No revert=pass)
  });

  function anyUint() {
    return (value: any) => typeof value === "bigint" || typeof value === "number";
  }
});
