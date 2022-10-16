const { expect } = require("chai");
const { ethers } = require("hardhat");
const { solidityKeccak256 } = require("ethers/lib/utils");

describe("CustomERC1155 contract", function () {
  let CustomERC1155;
  let customERC1155;
  let [owner, addr1, addr2] = [];

  before(async function () {
    CustomERC1155 = await ethers.getContractFactory("CustomERC1155");
    [owner, addr1, addr2] = await ethers.getSigners();

    customERC1155 = await CustomERC1155.deploy(
      "" // Add a custom URI
    );

    await customERC1155.deployed();
  });

  describe("Minting", function () {
    it("Should mint a erc721 token", async function () {
      const tokenId = 1223;
      await customERC1155.mint(
        addr1.address,
        tokenId,
        1,
        "0x0100000000000000000000000000000000000000000000000000000000000000"
      );
      expect(await customERC1155.balanceOf(addr1.address, tokenId)).to.equal(1);
    });

    it("Should mint if a erc20 token", async function () {
      const tokenId = 1224;
      await customERC1155.mint(
        addr1.address,
        tokenId,
        10000,
        "0x0100000000000000000000000000000000000000000000000000000000000000"
      );
      expect(await customERC1155.balanceOf(addr1.address, tokenId)).to.equal(
        10000
      );
    });
  });

  describe("Transferring", function () {
    it("Should transfer a token", async function () {
      await customERC1155
        .connect(addr1)
        .transferFrom(
          addr1.address,
          addr2.address,
          1223,
          1,
          "0x0100000000000000000000000000000000000000000000000000000000000000"
        );
      expect(await customERC1155.balanceOf(addr2.address, 1223)).to.equal(1);
    });
  });

  describe("Burn", function () {
    it("Should burn a token", async function () {
      await customERC1155.burn(addr2.address, 1223, 1);
      expect(await customERC1155.balanceOf(addr2.address, 1223)).to.equal(0);
    });
  });
});
