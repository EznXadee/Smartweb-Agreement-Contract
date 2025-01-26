// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Agreement {
    string public agreementText;
    address public owner;

    // Set the owner to the contract deployer
    constructor(string memory _text) {
        agreementText = _text;
        owner = msg.sender; // Deployer is the owner
    }

    // Function to retrieve the agreement text
    function getAgreement() public view returns (string memory) {
        return agreementText;
    }

    // Function to update the agreement text, only by the owner
    function updateAgreement(string memory _newText) public {
        require(msg.sender == owner, "Only the owner can update the agreement.");
        agreementText = _newText;
    }
}
