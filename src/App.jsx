import { useEffect, useState } from "react";
import { ethers } from "ethers"; // Correct import

function App() {
  const [agreementText, setAgreementText] = useState("");
  const [loading, setLoading] = useState(true);
  const [newAgreementText, setNewAgreementText] = useState(""); // State to store new agreement text
  const [updating, setUpdating] = useState(false); // State to handle loading for update

  const contractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; // Replace with your contract's address
  const contractABI = [
    "function getAgreement() public view returns (string memory)",
    "function updateAgreement(string memory _newText) public", // Function to update the agreement
  ];

  // Fetch the current agreement text from the contract
  useEffect(() => {
    async function fetchAgreement() {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum); // Correct usage for ethers@6.x.x
          const contract = new ethers.Contract(contractAddress, contractABI, provider);

          // Read the agreement text
          const text = await contract.getAgreement();
          setAgreementText(text);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching agreement:", error);
          setLoading(false);
        }
      } else {
        console.error("Ethereum provider (MetaMask) is not available.");
        setLoading(false);
      }
    }

    fetchAgreement();
  }, []);

  // Function to handle updating the agreement text in the contract
  const handleUpdateAgreement = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        setUpdating(true); // Show loading state for update

        // Ensure newAgreementText is not empty
        if (!newAgreementText) {
          alert("Agreement text cannot be empty.");
          setUpdating(false);
          return;
        }

        // Call the updateAgreement function from the contract
        const tx = await contract.updateAgreement(newAgreementText);
        await tx.wait(); // Wait for the transaction to be mined

        console.log("Agreement updated!");
        setAgreementText(newAgreementText); // Update frontend with new text
        setNewAgreementText(""); // Reset new text input field
        setUpdating(false); // Hide loading state
      } catch (error) {
        console.error("Error updating agreement:", error);
        setUpdating(false); // Hide loading state in case of error
        alert("Error occurred while updating the agreement.");
      }
    } else {
      console.error("Ethereum provider (MetaMask) is not available.");
    }
  };

  return (
    <div>
      <h1>Agreement Text</h1>
      {loading ? (
        "Loading Agreement..."
      ) : (
        <div>
          <p>{agreementText}</p>
          <div>
            <input
              type="text"
              value={newAgreementText}
              onChange={(e) => setNewAgreementText(e.target.value)}
              placeholder="Enter new agreement text"
            />
            <button onClick={handleUpdateAgreement} disabled={updating}>
              {updating ? "Updating..." : "Update Agreement"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
