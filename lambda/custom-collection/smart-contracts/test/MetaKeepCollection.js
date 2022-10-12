const { expect } = require("chai");
const { ethers } = require("hardhat");
const { solidityKeccak256 } = require("ethers/lib/utils");

describe("MetaKeepCollection contract", function () {
  let MetaKeepCollection;
  let metakeepCollection;
  let [owner, addr1, addr2] = [];

  before(async function () {
    MetaKeepCollection = await ethers.getContractFactory("MetaKeepCollection");
    [owner, addr1, addr2] = await ethers.getSigners();

    metakeepCollection = await MetaKeepCollection.deploy(
      "MetaKeep Originals",
      "MTKP"
    );

    await metakeepCollection.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await metakeepCollection.owner()).to.equal(owner.address);
    });

    it("Should set the right name", async function () {
      expect(await metakeepCollection.name()).to.equal("MetaKeep Originals");
    });

    it("Should set the right symbol", async function () {
      expect(await metakeepCollection.symbol()).to.equal("MTKP");
    });
  });

  describe("Whitelist", function () {
    it("Should add an address to the whitelist", async function () {
      await metakeepCollection.addToWhitelist(addr1.address);
      expect(await metakeepCollection.isWhitelisted(addr1.address)).to.equal(
        true
      );
    });

    it("Should remove an address from the whitelist", async function () {
      await metakeepCollection.removeFromWhitelist(addr1.address);
      expect(await metakeepCollection.isWhitelisted(addr1.address)).to.equal(
        false
      );
    });
  });

  describe("Minting", function () {
    it("Should not mint if the address is not whitelisted", async function () {
      await expect(
        metakeepCollection.mint(addr1.address, 123)
      ).to.be.revertedWith("Address is not whitelisted.");
    });
    it("Should mint a token", async function () {
      const tokenId = solidityKeccak256(
        ["address", "uint256"],
        [addr1.address, 0]
      );
      // whitelist the address
      await metakeepCollection.addToWhitelist(addr1.address);
      await metakeepCollection.mint(addr1.address, tokenId);
      expect(await metakeepCollection.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should not mint if the address has already minted", async function () {
      await expect(
        metakeepCollection.mint(addr1.address, 123)
      ).to.be.revertedWith("Address already owns a token.");
    });
  });

  describe("Transferring", function () {
    it("Should transfer a token", async function () {
      const tokenId = solidityKeccak256(
        ["address", "uint256"],
        [addr1.address, 0]
      );
      await metakeepCollection
        .connect(addr1)
        .transferFrom(addr1.address, addr2.address, tokenId);
      expect(await metakeepCollection.balanceOf(addr2.address)).to.equal(1);
    });
  });

  describe("Burn", function () {
    it("Should burn a token", async function () {
      const tokenId = solidityKeccak256(
        ["address", "uint256"],
        [addr1.address, 0]
      );
      await metakeepCollection.burn(tokenId);
      expect(await metakeepCollection.balanceOf(addr2.address)).to.equal(0);
    });
  });
});
