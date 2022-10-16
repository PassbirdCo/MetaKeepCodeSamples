const { expect } = require("chai");
const { ethers } = require("hardhat");
const { solidityKeccak256 } = require("ethers/lib/utils");

describe("CustomERC721 contract", function () {
  let CustomERC721;
  let customERC721;
  let [owner, addr1, addr2] = [];

  before(async function () {
    CustomERC721 = await ethers.getContractFactory("CustomERC721");
    [owner, addr1, addr2] = await ethers.getSigners();

    customERC721 = await CustomERC721.deploy(
      "MetaKeep Originals",
      "MTKP",
      owner.address
    );

    await customERC721.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      expect(await customERC721.name()).to.equal("MetaKeep Originals");
    });

    it("Should set the right symbol", async function () {
      expect(await customERC721.symbol()).to.equal("MTKP");
    });
  });

  describe("Whitelist", function () {
    it("Should add an address to the whitelist", async function () {
      await customERC721.addToWhitelist(addr1.address);
      expect(await customERC721.isWhitelisted(addr1.address)).to.equal(true);
    });

    it("Should remove an address from the whitelist", async function () {
      await customERC721.removeFromWhitelist(addr1.address);
      expect(await customERC721.isWhitelisted(addr1.address)).to.equal(false);
    });
  });

  describe("Minting", function () {
    it("Should not mint if the address is not whitelisted", async function () {
      await expect(customERC721.mint(addr1.address, 123)).to.be.revertedWith(
        "Address is not whitelisted."
      );
    });
    it("Should mint a token", async function () {
      const tokenId = solidityKeccak256(
        ["address", "uint256"],
        [addr1.address, 0]
      );
      // whitelist the address
      await customERC721.addToWhitelist(addr1.address);
      await customERC721.mint(addr1.address, tokenId);
      expect(await customERC721.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should not mint if the address has already minted", async function () {
      await expect(customERC721.mint(addr1.address, 123)).to.be.revertedWith(
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
      expect(await customERC721.balanceOf(addr2.address)).to.equal(1);
    });
  });

  describe("Burn", function () {
    it("Should burn a token", async function () {
      const tokenId = solidityKeccak256(
        ["address", "uint256"],
        [addr1.address, 0]
      );
      await customERC721.burn(tokenId);
      expect(await customERC721.balanceOf(addr2.address)).to.equal(0);
    });
  });
});
