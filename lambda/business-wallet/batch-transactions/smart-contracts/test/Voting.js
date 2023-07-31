const { expect } = require("chai");
const { ethers } = require("hardhat");
const { solidityKeccak256 } = require("ethers/lib/utils");

describe("Voting contract", function () {
  let Voting;
  let votingContract;
  let [owner, addr1, addr2] = [];

  before(async function () {
    Voting = await ethers.getContractFactory("Voting");
    [owner, addr1, addr2] = await ethers.getSigners();

    votingContract = await Voting.deploy();

    await votingContract.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Voting Functions", function () {
    it("anyone should be able to add proposal", async function () {
      await votingContract
        .connect(owner)
        .addProposal("new Park", "Should we build a new park?");
      // it should be able to get the proposal
      const proposal = await votingContract.getProposal(0);

      expect(proposal[1]).to.equal("new Park");
      expect(proposal[3]).to.equal("Should we build a new park?");
    });

    it("anyone should be able to stake", async function () {
      await votingContract.connect(owner).stake({ value: 1000000000000000 });

      // check the stake of the owner
      const stake = await votingContract.stakes(owner.address);
    });

    it("no one should be able to vote if they haven't staked", async function () {
      await expect(votingContract.connect(addr1).vote(0)).to.be.revertedWith(
        "You need to stake some ETH"
      );
    });

    it("anyone should be able to vote", async function () {
      await votingContract.connect(owner).vote(0);

      // check the vote of the owner
      const vote = await votingContract.voters(owner.address);

      expect(vote).to.equal(true);
    });

    it("once voted, should not be able to vote again", async function () {
      await expect(votingContract.connect(owner).vote(0)).to.be.revertedWith(
        "You have already voted"
      );
    });
  });
});
