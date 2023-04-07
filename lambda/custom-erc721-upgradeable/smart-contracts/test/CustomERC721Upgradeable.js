const { expect } = require("chai");
const { ethers } = require("hardhat");
const { solidityKeccak256 } = require("ethers/lib/utils");

describe("CustomERC721 contract", function () {
  let CustomERC721;
  let customERC721;
  let customERC721Proxy;
  let [owner, addr1, addr2] = [];

  before(async function () {
    CustomERC721 = await ethers.getContractFactory("CustomERC721Upgradeable");
    [owner, addr1, addr2] = await ethers.getSigners();

    customERC721 = await customERC721WithProxy.deploy(
      "MetaKeep Originals",
      "MTKP",
      owner.address
    );

    await customERC721WithProxy.deployed();

    const CustomERC721Proxy = await ethers.getContractFactory(
      "CustomERC721Proxy"
    );
    customERC721Proxy = await CustomERC721Proxy.deploy(
      owner.address,
      "MetaKeep Originals",
      customERC721WithProxy.address,
      "0x"
    );

    await customERC721Proxy.deployed();

    customERC721WithProxy = await customERC721WithProxy.attach(customERC721Proxy.address);

    await customERC721WithProxy.initialize("MetaKeep Originals", "MTKP", owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      expect(await customERC721WithProxy.name()).to.equal("MetaKeep Originals");
    });

    it("Should set the right symbol", async function () {
      expect(await customERC721WithProxy.symbol()).to.equal("MTKP");
    });
  });

  describe("Whitelist", function () {
    it("Should add an address to the whitelist", async function () {
      await customERC721WithProxy.addToWhitelist(addr1.address);
      expect(await customERC721WithProxy.isWhitelisted(addr1.address)).to.equal(true);
    });

    it("Should remove an address from the whitelist", async function () {
      await customERC721WithProxy.removeFromWhitelist(addr1.address);
      expect(await customERC721WithProxy.isWhitelisted(addr1.address)).to.equal(false);
    });
  });

  describe("Minting", function () {
    it("Should not mint if the address is not whitelisted", async function () {
      await expect(customERC721WithProxy.mint(addr1.address, 123)).to.be.revertedWith(
        "Address is not whitelisted."
      );
    });
    it("Should mint a token", async function () {
      const tokenId = solidityKeccak256(
        ["address", "uint256"],
        [addr1.address, 0]
      );
      // whitelist the address
      await customERC721WithProxy.addToWhitelist(addr1.address);
      await customERC721WithProxy.mint(addr1.address, tokenId);
      expect(await customERC721WithProxy.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should not mint if the address has already minted", async function () {
      await expect(customERC721WithProxy.mint(addr1.address, 123)).to.be.revertedWith(
        "Address already owns a token."
      );
    });
  });

  describe("Transferring", function () {
    it("Should transfer a token", async function () {
      const tokenId = solidityKeccak256(
        ["address", "uint256"],
        [addr1.address, 0]
      );
      await customERC721
        .connect(addr1)
        .transferFrom(addr1.address, addr2.address, tokenId);
      expect(await customERC721WithProxy.balanceOf(addr2.address)).to.equal(1);
    });
  });

  describe("Burn", function () {
    it("Should burn a token", async function () {
      const tokenId = solidityKeccak256(
        ["address", "uint256"],
        [addr1.address, 0]
      );
      await customERC721WithProxy.burn(tokenId);
      expect(await customERC721WithProxy.balanceOf(addr2.address)).to.equal(0);
    });
  });

  describe("Upgrade", function () {
    it("Should upgrade the contract", async function () {
      const CustomERC721V2 = await ethers.getContractFactory(
        "CustomERC721UpgradeableV2"
      );
      const customERC721V2 = await CustomERC721V2.deploy(
        "MetaKeep Originals",
        "MTKP",
        owner.address
      );

      await customERC721V2.deployed();

      await customERC721WithProxy.upgradeTo(customERC721V2.address);

      expect(await customERC721WithProxy.name()).to.equal("MetaKeep Originals");
    });

    it("should not upgrade the contract if the sender is not the owner", async function () {
      const CustomERC721V2 = await ethers.getContractFactory(
        "CustomERC721UpgradeableV2"
      );
      const customERC721V2 = await CustomERC721V2.deploy(
        "MetaKeep Originals",
        "MTKP",
        owner.address
      );

      await customERC721V2.deployed();

      await expect(
        customERC721WithProxy.connect(addr1).upgradeTo(customERC721V2.address)
      ).to.be.revertedWith("MetaKeepLambda: Not owner");
    });
  });
});
