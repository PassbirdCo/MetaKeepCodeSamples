pragma solidity ^0.8.0;

import "metakeep-lambda/ethereum/contracts/MetaKeepLambdaUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


contract VotingUpgradeable is MetaKeepLambdaUpgradeable, UUPSUpgradeable {
    struct Candidate {
        address candidate_address;
        uint256 votes;
    }

  constructor(address lambdaOwner, string memory lambdaName) {
  }

    function _msgSender() internal view override returns (address sender) {
        return MetaKeepLambdaSender.msgSender();
    }

    mapping(bytes32 => Candidate) private candidates;
    mapping(address => bool) private voters;

    function _authorizeUpgrade(address) internal override onlyMetaKeepLambdaOwner {}

    function registerCandidate(address candidate_address) public onlyMetaKeepLambdaOwner() {
        Candidate storage candidate = candidates[keccak256(abi.encodePacked(candidate_address))];
        candidate.candidate_address = candidate_address;
        candidate.votes = 0;
    }

    function voteForCandidate(bytes32 id) public {
        require(candidates[id].candidate_address != address(0), "Candidate does not exist.");
        require(candidates[id].candidate_address != _msgSender(), "You cannot vote for yourself.");
        require(!voters[_msgSender()], "You have already voted.");
        Candidate storage candidate = candidates[id];
        voters[_msgSender()] = true;
        candidate.votes += 1;
    }

    function getWinner(bytes32[] memory ids) public view onlyMetaKeepLambdaOwner() returns (address) {
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

    function getCandidate(bytes32 id) view public returns (address, uint256) {
        require(candidates[id].candidate_address != address(0), "Candidate does not exist.");
        return (candidates[id].candidate_address, candidates[id].votes);
    }
}