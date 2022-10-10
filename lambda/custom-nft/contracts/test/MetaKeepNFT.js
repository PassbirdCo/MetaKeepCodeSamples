const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MetaKeep NFT", function () {
  let MetaKeepNFT;
  let mtkpnft;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  before(async function () {
    MetaKeepNFT = await ethers.getContractFactory("MetaKeepNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    mtkpnft = await MetaKeepNFT.deploy(
      "TT",
      owner.address,
      "Test Token",
      "0x0000000000000000000000000000000000000000"
    );
  });
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mtkpnft.owner()).to.equal(owner.address);
    });
  });
  describe("Mint And Destroy NFT", function () {
    it("Should mint NFT", async function () {
      await mtkpnft.mint(addr1.address, 100);
      expect(await mtkpnft.balanceOf(addr1.address)).to.equal(1);
    });
    it("Should be able to place NFT token for sales", async function () {
      await mtkpnft.addForSale(100, 20000000000);
      //get NFT sale data
      const nftSaleData = await mtkpnft.getNFTSaleInfo(100);
      expect(nftSaleData[0]).to.equal(addr1.address);
      expect(nftSaleData[2]).to.equal(20000000000);
    });

    it("Should be able to buy NFT", async function () {
      await mtkpnft.connect(addr2).buy(100);
      expect(await mtkpnft.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should be able to destroy NFT", async function () {
      await mtkpnft.destroy(100);
      expect(await mtkpnft.balanceOf(addr1.address)).to.equal(0);
    });
  });
});
