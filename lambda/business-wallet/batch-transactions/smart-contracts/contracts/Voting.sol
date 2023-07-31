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
        require(msg.value >= 100000000000000, "You need to stake some ETH");
        stakes[msg.sender] = msg.value;
    }

    function unstake() public {
        require(voters[msg.sender] == false, "You have already voted");
        require(stakes[msg.sender] >= 100000000000000, "You need to stake some ETH");
        uint256 amount = stakes[msg.sender];
        stakes[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function vote(uint256 proposalId) public {
      // check if voter has staked 0.0001 ETH
        require(stakes[msg.sender] >= 100000000000000, "You need to stake some ETH");
        require(!voters[msg.sender], "You have already voted");
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal id");
        voters[msg.sender] = true;
        proposals[proposalId].voteCount++;
    }

    function getProposal(uint256 proposalId) public view returns (proposal memory) {
        require(proposalId >= 0 && proposalId <= proposalCount, "Invalid proposal id");
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

    // add a fallback function to receive ETH
    receive() external payable {}

}