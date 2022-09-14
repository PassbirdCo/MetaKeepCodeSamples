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


    votingContract = await Voting.deploy(owner.address);

    await votingContract.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Voting Functions", function () {

    it("Should set the right owner", async function () {

      // Expect receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await votingContract.getOwner()).to.equal(owner.address);
    });

    it("Owner should be able to register the candidate", async function () {

      await votingContract.connect(owner).registerCandidate(addr1.address);

      const candidateId = solidityKeccak256(["address"], [addr1.address]);

      const candidate = await votingContract.getCandidate(candidateId);

      

      expect(candidate[0]).to.equal(addr1.address);
      expect(candidate[1]).to.equal(0);

    });

    it("Voter should be able to vote to correct candidate", async function () {

      const candidateId = solidityKeccak256(["address"], [addr1.address]);

      await votingContract.connect(addr2).voteForCandidate(candidateId);

      const candidate = await votingContract.getCandidate(candidateId);

      expect(candidate[1]).to.equal(1);

    });

    it("Voter should not be able to vote twice", async function () {
        
        const candidateId = solidityKeccak256(["address"], [addr1.address]);
  
        await expect(votingContract.connect(addr2).voteForCandidate(candidateId)).to.be.revertedWith("You have already voted.");
  
      });
    
    it("Voter should not be able to vote to wrong candidate", async function () {
          
          const candidateId = solidityKeccak256(["address"], [addr2.address]);
    
          await expect(votingContract.connect(addr2).voteForCandidate(candidateId)).to.be.revertedWith("Candidate does not exist.");
    
        });
    
    it("Voter should not be able to vote for itself", async function () {

      const candidateId = solidityKeccak256(["address"], [addr1.address]);

      await expect(votingContract.connect(addr1).voteForCandidate(candidateId)).to.be.revertedWith("You cannot vote for yourself.");

      
    });

    it("Owner should be able to get the winner", async function () {
        
        const candidateId_1 = solidityKeccak256(["address"], [addr1.address]);
        const candidateId_2 = solidityKeccak256(["address"], [addr2.address]);

  
        const winner = await votingContract.getWinner([candidateId_1, candidateId_2]);
  
        expect(winner).to.equal(addr1.address);
  
      });
  });
});
