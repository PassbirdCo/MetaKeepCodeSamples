pragma solidity ^0.8.0;

contract Voting {

    address public Owner;

    struct Candidate {
        address candidate_address;
        uint256 votes;
    }

    modifier onlyOwner() {
        require(msg.sender == Owner, "Only owner can call this function.");
        _;
    }
  
  
  mapping(bytes32 => Candidate) public candidates;

  // Initialize all the contestants
  constructor(address owner) {
    Owner = owner;
  }

  function registerCandidate(address candidate_address) public onlyOwner {
    Candidate storage candidate = candidates[keccak256(abi.encode(candidate_address))];
    candidate.candidate_address = candidate_address;
    candidate.votes = 0;
  }

    function voteForCandidate(bytes32 id) public {
        require(candidates[id].candidate_address != address(0), "Candidate does not exist.");
        Candidate storage candidate = candidates[id];
        candidate.votes += 1;
    }

  function totalVotesFor(bytes32 id) view public returns (uint256) {
    require(candidates[id].candidate_address != address(0), "Candidate does not exist.");
    return candidates[id].votes;
  }

}