// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {

    // Structure to represent a candidate
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Private state variables
    mapping(address => bool) private registeredVoters;
    mapping(address => uint256) private votes;
    mapping(string => uint256) private candidateIndexes;
    Candidate[] private candidates;

    // Contract owner address
    address private owner;

    // Only voter modifier
    modifier onlyVoter() {
        require(registeredVoters[msg.sender], "Only registered voters can interact with this contract");
        _;
    }

    // Constructor
    constructor(string[] memory candidateNames) {
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0
            }));
            candidateIndexes[candidateNames[i]] = i;
        }
        owner = msg.sender;
    }

    // Function for the contract owner to register new voters
    function registerVoter(address voterAddress) public onlyOwner {
        registeredVoters[voterAddress] = true;
    }

    // Function to retrieve the names of all candidates
    function getCandidates() public onlyVoter view returns (string[] memory) {
        string[] memory candidateNames = new string[](candidates.length);
        for (uint256 i = 0; i < candidates.length; i++) {
            candidateNames[i] = candidates[i].name;
        }
        return candidateNames;
    }

    // Function to vote for a candidate by name
    function voteByName(string memory candidateName) public onlyVoter {
        require(candidateIndexes[candidateName] >= 0, "Invalid candidate name");
        require(votes[msg.sender] == 0, "You have already voted");

        candidates[candidateIndexes[candidateName]].voteCount++;
        votes[msg.sender] = 1;
    }

    // Function that will get all candidates and their vote count
    function getAllCandidatesWithVoteCount() public view returns (Candidate[] memory) {
        require(votes[msg.sender] == 1, "You have not voted");
        Candidate[] memory allCandidates = new Candidate[](candidates.length);
        for (uint256 i = 0; i < candidates.length; i++) {
            allCandidates[i] = Candidate({
                name: candidates[i].name,
                voteCount: candidates[i].voteCount
            });
        }
        return allCandidates;
    }

    // Owner-only modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }
}
