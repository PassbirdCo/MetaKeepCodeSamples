const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MetaKeep NFT", function () {
  let MetaKeepNFT;
  let mtkpnft;
  let dummyToken;
  let DummyERC20;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  before(async function () {
    MetaKeepNFT = await ethers.getContractFactory("MetaKeepNFT");

    // deploys the dummy erc20 token that will be used to pay the cost of the nft
    DummyERC20 = await ethers.getContractFactory("DummyERC20");
    dummyToken = await DummyERC20.deploy();
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    mtkpnft = await MetaKeepNFT.deploy(
      "TT",
      owner.address,
      "Test Token",
      dummyToken.address
    );

    // mint 1000 tokens to addr1 so that they can pay the cost for nft
    dummyToken.mint(addr2.address, ethers.utils.parseEther("1000"));

    // approve the nft contract to spend the tokens on behalf of addr1
    dummyToken
      .connect(addr2)
      .approve(mtkpnft.address, ethers.utils.parseEther("1000"));
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
      // place the nft for sale
      await mtkpnft.addForSale(100, 2000000000);
      //get NFT sale data
      const nftSaleData = await mtkpnft.getNFTSaleInfo(100);
      expect(nftSaleData[0]).to.equal(addr1.address);
      expect(nftSaleData[2]).to.equal(2000000000);
    });

    it("Should be able to buy NFT", async function () {
      // buys the nft
      await mtkpnft.connect(addr2).buy(100);

      // checks if the cost is paid to the seller ie Addr1.
      const balance = await dummyToken.connect(addr2).balanceOf(addr1.address);
      expect(balance).to.equal(1600000000);

      // checks if the comission is paid to the nft smart contract
      const balanceOfNFTContract = await dummyToken
        .connect(addr2)
        .balanceOf(mtkpnft.address);
      expect(balanceOfNFTContract).to.equal(400000000);

      // checks if the nft is transferred to the buyer ie addr2
      expect(await mtkpnft.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should be able to destroy NFT", async function () {
      // destroys the nft
      await mtkpnft.destroy(100);

      // checks if the nft is destroyed
      expect(await mtkpnft.balanceOf(addr2.address)).to.equal(0);
    });
  });
});
