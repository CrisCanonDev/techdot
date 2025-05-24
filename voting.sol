// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// We have to specify what version of compiler this code will compile with

contract Voting {
  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is candidate name stored as type bytes32 and value is
  an unsigned integer to store the vote count
  */
  
  mapping (bytes32 => uint8) public votesReceived;
  
  /* Solidity doesn't let you pass in an array of strings in the constructor (yet).
  We will use an array of bytes32 instead to store the list of candidates
  */
  
  bytes32[] public candidateList;


  // one person one vote
  mapping (address => bool) public hasVoted;

  //deadline 
  uint public votingDeadline;

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of candidates who will be contesting in the election
  */
  constructor(bytes32[] memory candidateNames, uint durationInHours) {
    candidateList = candidateNames;

    //deadline
    votingDeadline = block.timestamp + durationInHours;
  }

  // This function returns the total votes a candidate has received so far
  function totalVotesFor(bytes32 candidate) public view returns (uint8) {
    require(validCandidate(candidate), "Invalid candidate");
    return votesReceived[candidate];
  }

  // This function increments the vote count for the specified candidate. This
  // is equivalent to casting a vote
  function voteForCandidate(bytes32 candidate) public {

    // check deadline & if voted
    require(block.timestamp < votingDeadline);
    require(!hasVoted[msg.sender], "You have already voted.");
    require(validCandidate(candidate), "Invalid candidate.");

    votesReceived[candidate] += 1;
    //set voted
    hasVoted[msg.sender] = true;
  }

  function validCandidate(bytes32 candidate) public view returns (bool) {
    for(uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return true;
      }
    }
    return false;
  }

  //get winner
  function getWinner() public view returns (bytes32) {
    require(block.timestamp >= votingDeadline, "Voting is still ongoing...");
    bytes32 winner;
    uint8 highestVotes = 0;

    for (uint i = 0; i < candidateList.length; i++) {
      if (votesReceived[candidateList[i]] > highestVotes) {
        highestVotes = votesReceived[candidateList[i]];
        winner = candidateList[i];
      }
    }
    return winner;
  }

  //get remaining time left
  function timeLeft() public view returns (uint) {
    if (block.timestamp >= votingDeadline) return 0;
    return votingDeadline - block.timestamp;
}


}
