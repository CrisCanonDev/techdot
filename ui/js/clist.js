$(document).ready(async function () {
    //if (typeof window.ethereum === 'undefined') {
        //alert("Please install MetaMask to vote.");
        //return;
    //}

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contractAddress = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"; 
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

    function disableButtons() {
        $('#vote1').prop("disabled", true);
        $('#vote2').prop("disabled", true);
        $('#vote3').prop("disabled", true);
        $('#vote4').prop("disabled", true);
        $('#vote-status').text("You have already voted or voting period ended.");
    }

    async function handleVote(candidateName, candidateHex) {
        try {
            const deadline = await contract.votingDeadline();
            const now = Math.floor(Date.now() / 1000);
            if (now > deadline) {
                $('#vote-status').text("Voting has ended.");
                disableButtons();
                return;
            }

            const hasVoted = await contract.hasVoted(await signer.getAddress());
            if (hasVoted) {
                $('#vote-status').text("You have already voted.");
                disableButtons();
                return;
            }

            const tx = await contract.voteForCandidate(candidateHex);
            await tx.wait();
            $('#vote-status').text(`Vote submitted for ${candidateName}!`);
            disableButtons();
        } catch (err) {
            console.error(err);
            $('#vote-status').text("Error: " + err.message);
        }
    }

    $('#vote1').click(() => handleVote("Alice", ethers.utils.formatBytes32String("Alice")));
    $('#vote2').click(() => handleVote("Bob", ethers.utils.formatBytes32String("Bob")));
    $('#vote3').click(() => handleVote("Cathy", ethers.utils.formatBytes32String("Cathy")));
    $('#vote4').click(() => handleVote("Daniel", ethers.utils.formatBytes32String("Daniel")));
});