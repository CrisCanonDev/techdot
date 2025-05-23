const users = {
	alice: "1234",
	bob: "1234",
	cathy: "1234",
	Daniel: "1234"
  };
  
  $(document).ready(function () {
	$('#messagebox').hide();
  
	$('#login').click(function () {
	  const username = $('#username').val();
	  const password = $('#password').val();
  
	  if (users[username] && users[username] === password) {
		$('#messagebox').hide();
		$('.loginscreen').hide();
		$('#votingBox').show();
	  } else {
		$('#messagebox').show();
		$('#errormsg').text("Invalid username or password.");
	  }
	});
  });

  async function vote(candidateHex) {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	await provider.send("eth_requestAccounts", []);
	const signer = provider.getSigner();
  
	const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
	const abi = [[
		{
			"inputs": [
				{
					"internalType": "bytes32[]",
					"name": "candidateNames",
					"type": "bytes32[]"
				},
				{
					"internalType": "uint256",
					"name": "durationInSeconds",
					"type": "uint256"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "candidateList",
			"outputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getWinner",
			"outputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "hasVoted",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "candidate",
					"type": "bytes32"
				}
			],
			"name": "totalVotesFor",
			"outputs": [
				{
					"internalType": "uint8",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "candidate",
					"type": "bytes32"
				}
			],
			"name": "validCandidate",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "candidate",
					"type": "bytes32"
				}
			],
			"name": "voteForCandidate",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"name": "votesReceived",
			"outputs": [
				{
					"internalType": "uint8",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "votingDeadline",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	]];
  
	const contract = new ethers.Contract(contractAddress, abi, signer);
  
	try {
	  const tx = await contract.voteForCandidate(candidateHex);
	  await tx.wait();
	  $('#vote-status').text("Vote submitted successfully!");
	} catch (err) {
	  $('#vote-status').text("Error: " + err.message);
	}
  }
