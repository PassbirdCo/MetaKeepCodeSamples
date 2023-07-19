pragma solidity ^0.8.0;

contract Voting {

    struct proposal {
        uint256 id;
        string name;
        uint256 voteCount;
        string description;
    }
  
  
    mapping(address => bool) public voters;

    mapping(address => uint256) public stakes;

    mapping(uint256 => proposal) public proposals;

    uint256 public proposalCount;

    constructor() {
        proposalCount = 0;
    }

    function addProposal(string memory name, string memory description) public {
        proposalCount++;
        proposals[proposalCount] = proposal(proposalCount, name, 0, description);
    }

    function stake() public payable {
        require(msg.value == 1000000000000000, "You need to stake some ETH");
        stakes[msg.sender] = msg.value;
    }

    function unstake(address user) public {
        require(voters[user] == false, "You have already voted");
        require(stakes[user] == 1000000000000000, "You need to stake some ETH");
        stakes[user] = 0;
    }

    function vote(address voter, uint256 proposalId) public {
      // check if voter has staked 0.0001 ETH
        require(stakes[voter] == 1000000000000000, "You need to stake some ETH");
        require(!voters[voter], "You have already voted");
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal id");
        voters[voter] = true;
        proposals[proposalId].voteCount++;
    }

    function getProposal(uint256 proposalId) public view returns (proposal memory) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal id");
        return proposals[proposalId];
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCount;
    }

    function getVoter(address voter) public view returns (bool) {
        return voters[voter];
    }

    function getWinningProposal() public view returns (proposal memory) {
        uint256 winningVoteCount = 0;
        uint256 winningProposalId = 0;
        for (uint256 i = 0; i < proposalCount; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
        return proposals[winningProposalId];
    }

}