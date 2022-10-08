const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MetaKeep Certificate", function () {
  let MetaKeepCertificate;
  let certificate;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  before(async function () {
    MetaKeepCertificate = await ethers.getContractFactory(
      "MetaKeepCertificates"
    );
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    certificate = await MetaKeepCertificate.deploy(
      "TT",
      owner.address,
      "Test Token"
    );
  });
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await certificate.owner()).to.equal(owner.address);
    });
  });
  describe("Mint And Destroy Certificate", function () {
    it("Should mint certificate", async function () {
      await certificate.mint(addr1.address, 100, "bob", "bob@email.com");
      expect(await certificate.balanceOf(addr1.address)).to.equal(1);
    });

    it("should return the correct certificate", async function () {
      const certificateData = await certificate.getCertificate(100);
      expect(certificateData[0]).to.equal("bob");
      expect(certificateData[1]).to.equal("bob@email.com");
      expect(certificateData[2]).to.equal(100);
    });

    it("Should not be able to transfer certificate as it is soulbound tokens", async function () {
      await expect(
        certificate
          .connect(addr1)
          .transferFrom(addr1.address, addr2.address, 100)
      ).to.be.revertedWith("Cannot transfer");
    });

    it("Should be able to destroy certificate", async function () {
      await certificate.destroy(100);
      expect(await certificate.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should return null information if certificate is destroyed", async function () {
      const certificateData = await certificate.getCertificate(100);
      expect(certificateData[0]).to.equal("");
      expect(certificateData[1]).to.equal("");
      expect(certificateData[2]).to.equal(0);
    });
  });
});
