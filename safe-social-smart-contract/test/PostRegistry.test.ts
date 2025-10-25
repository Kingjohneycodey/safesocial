import { expect } from "chai";
import { ethers } from "hardhat";

describe("PostRegistry Integration", function () {
  let owner: any, alice: any, bob: any, medic: any;
  let vault: any, registry: any;
  let fileId: any;

  beforeEach(async () => {
    [owner, alice, bob, medic] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("DataVault");
    vault = await Vault.deploy();
    await vault.waitForDeployment();
    const Registry = await ethers.getContractFactory("PostRegistry");
    registry = await Registry.deploy(await vault.getAddress());
    await registry.waitForDeployment();
    fileId = ethers.keccak256(ethers.toUtf8Bytes("post1"));
    await vault.connect(owner).registerFile(fileId, "ipfs-cid-1", "meta-cid-1");
  });

  it("allows post creation referencing DataVault file", async () => {
    const tx = await registry.connect(owner).createPost(fileId, "desc", 0, false);
    await expect(tx).to.emit(registry, "PostCreated");
    const post = await registry.posts(1);
    expect(post.fileId).to.equal(fileId);
    expect(post.owner).to.equal(owner.address);
  });

  it("enforces only owner can update post fileId", async () => {
    await registry.connect(owner).createPost(fileId, "desc", 0, false);
    const fileId2 = ethers.keccak256(ethers.toUtf8Bytes("post2"));
    await vault.connect(owner).registerFile(fileId2, "ipfs-cid-2", "meta2");
    await expect(
      registry.connect(alice).updatePostContent(1, fileId2)
    ).to.be.revertedWith("Caller is not the owner");
    await expect(registry.connect(owner).updatePostContent(1, fileId2)).to.emit(
      registry,
      "PostUpdated"
    );
  });

  it("validates subscription and paid content logic", async () => {
    await registry.connect(owner).setSubscriptionDetails(ethers.parseEther("1"), 100);
    await registry.connect(owner).createPost(fileId, "desc", ethers.parseEther("1"), false);
    await expect(
      registry.connect(alice).subscribe(owner.address, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Incorrect subscription fee paid");
    await registry.connect(alice).subscribe(owner.address, { value: ethers.parseEther("1") });
    expect(await registry.isSubscribed(owner.address, alice.address)).to.equal(true);
  });

  it("returns true for public, owner, or subscriber", async () => {
    const privFile = ethers.keccak256(ethers.toUtf8Bytes("private"));
    await vault.connect(owner).registerFile(privFile, "ipfs-priv", "meta-priv");
    await registry.connect(owner).setSubscriptionDetails(1, 100);
    await registry.connect(owner).createPost(privFile, "desc", 0, false);
    // owner can access
    expect(await registry.canUserAccessPost(1, owner.address)).to.equal(true);
    // not public, not yet subscriber
    expect(await registry.canUserAccessPost(1, alice.address)).to.equal(false);
    // subscribe
    await registry.connect(alice).subscribe(owner.address, { value: 1 });
    expect(await registry.canUserAccessPost(1, alice.address)).to.equal(true);
    // grant bob via DataVault only
    await vault.connect(owner).grantAccess(privFile, bob.address, "enckeybob");
    expect(await registry.canUserAccessPost(1, bob.address)).to.equal(true);
  });

  it("prevents non-owners from updating posts", async () => {
    const tx = await registry.connect(owner).createPost(fileId, "desc", 123, false);
    await expect(registry.connect(alice).updatePostContent(1, fileId)).to.be.revertedWith("Caller is not the owner");
  });

  it("enforces price field is correct for post", async () => {
    const tx = await registry.connect(owner).createPost(fileId, "premium post", ethers.parseEther("5"), false);
    const post = await registry.posts(1);
    expect(post.price).to.equal(ethers.parseEther("5"));
  });
});
