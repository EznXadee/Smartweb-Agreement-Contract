// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Agreement {
    address public partyA;
    address public partyB;
    bool public isSignedByPartyA = false;
    bool public isSignedByPartyB = false;
    string public document;

    // Event to notify when the agreement is signed
    event AgreementSigned(address signer);
    event DocumentFinalized(string document);

    // Constructor to initialize parties and the document
    constructor(address _partyB, string memory _document) {
        partyA = msg.sender; // Deployer is Party A
        partyB = _partyB;
        document = _document;
    }

    // Function for Party A to sign the agreement
    function signByPartyA() public {
        require(msg.sender == partyA, "Only Party A can sign.");
        require(!isSignedByPartyA, "Party A has already signed.");
        isSignedByPartyA = true;
        emit AgreementSigned(partyA);
    }

    // Function for Party B to sign the agreement
    function signByPartyB() public {
        require(msg.sender == partyB, "Only Party B can sign.");
        require(!isSignedByPartyB, "Party B has already signed.");
        isSignedByPartyB = true;
        emit AgreementSigned(partyB);
    }

    // Function to check if the agreement is complete
    function isAgreementComplete() public view returns (bool) {
        return isSignedByPartyA && isSignedByPartyB;
    }

    // Function to finalize the document on the blockchain
    function finalizeAgreement() public view returns (string memory) {
        require(isAgreementComplete(), "Agreement is not complete.");
        return document;
    }
}
