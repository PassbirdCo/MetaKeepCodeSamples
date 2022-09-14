pragma solidity ^0.8.0;

contract Voting {

    address private Owner;

    struct Candidate {
        address candidate_address;
        uint256 votes;
    }

    modifier onlyOwner() {
        require(msg.sender == Owner, "Only owner can call this function.");
        _;
    }
  
  
  mapping(bytes32 => Candidate) private candidates;
  mapping(address => bool) private voters;

  // Initialize all the contestants
  constructor(address owner) {
    Owner = owner;
  }

  function registerCandidate(address candidate_address) public onlyOwner {
    Candidate storage candidate = candidates[keccak256(abi.encodePacked(candidate_address))];
    candidate.candidate_address = candidate_address;
    candidate.votes = 0;
  }

    function voteForCandidate(bytes32 id) public {
        require(candidates[id].candidate_address != address(0), "Candidate does not exist.");
        require(candidates[id].candidate_address != msg.sender, "You cannot vote for yourself.");
        require(!voters[msg.sender], "You have already voted.");
        Candidate storage candidate = candidates[id];
        voters[msg.sender] = true;
        candidate.votes += 1;
    }

    function getWinner(bytes32[] memory ids) public view onlyOwner returns (address) {
        uint256 max_votes = 0;
        address winner;
        for (uint256 i = 0; i < ids.length; i++) {
            if (candidates[ids[i]].votes > max_votes) {
                max_votes = candidates[ids[i]].votes;
                winner = candidates[ids[i]].candidate_address;
            }
        }
        return winner;
    }

  function totalVotesFor(bytes32 id) view public returns (uint256) {
    require(candidates[id].candidate_address != address(0), "Candidate does not exist.");
    return candidates[id].votes;
  }

  function getOwner() view public returns (address) {
    return Owner;
  }

  function getCandidate(bytes32 id) view public returns (address, uint256) {
    require(candidates[id].candidate_address != address(0), "Candidate does not exist.");
    return (candidates[id].candidate_address, candidates[id].votes);
  }

}