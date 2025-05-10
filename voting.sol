pragma solidity ^0.4.11;
// We have to specify what version of compiler this code will compile with

contract Voting {
  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is candidate name stored as type bytes32 and value is
  an unsigned integer to store the vote count
  */
  
  mapping (bytes32 => uint8) public votesReceived;
  mapping ()
  
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
  function Voting(bytes32[] candidateNames, uint durationInSeconds) {
    candidateList = candidateNames;

    //deadline
    votingDeadline = now+ durationInSeconds;
  }

  // This function returns the total votes a candidate has received so far
  function totalVotesFor(bytes32 candidate) returns (uint8) {
    if (validCandidate(candidate) == false) throw;
    return votesReceived[candidate];
  }

  // This function increments the vote count for the specified candidate. This
  // is equivalent to casting a vote
  function voteForCandidate(bytes32 candidate) {

    // check deadline & if voted
    require(now < votingDeadline);
    require(!hasVoted[msg.sender]);

    if (validCandidate(candidate) == false) throw;
    votesReceived[candidate] += 1;

    //set voted
    hasVoted[msg.sender] = true;
  }

  function validCandidate(bytes32 candidate) returns (bool) {
    for(uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return true;
      }
    }
    return false;
  }

  //get winner
  function getWinner() public view returns (bytes32) {
    require(now >= votingDeadline);
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



}
