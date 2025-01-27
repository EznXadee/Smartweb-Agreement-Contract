import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Card, Button, Typography, Spin, notification } from "antd";
import AgreementABI from "../artifacts/contracts/Agreement.sol/Agreement.json";

const { Title, Text } = Typography;

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [agreementAddress] = useState("0x4931Fc31AcDfbF19c79e4AbaB4982D130698fCc9"); // Replace with deployed contract address
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [document, setDocument] = useState("");
  const [isSignedByA, setIsSignedByA] = useState(false);
  const [isSignedByB, setIsSignedByB] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeWeb3 = async () => {
      const web3Instance = new Web3("http://127.0.0.1:7545"); // Ganache RPC URL
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);

      const contractInstance = new web3Instance.eth.Contract(
        AgreementABI.abi,
        agreementAddress
      );
      setContract(contractInstance);

      try {
        const a = await contractInstance.methods.partyA().call();
        const b = await contractInstance.methods.partyB().call();
        const doc = await contractInstance.methods.document().call();

        setPartyA(a);
        setPartyB(b);
        setDocument(doc);

        const signedA = await contractInstance.methods.isSignedByPartyA().call();
        const signedB = await contractInstance.methods.isSignedByPartyB().call();

        setIsSignedByA(signedA);
        setIsSignedByB(signedB);
      } catch (error) {
        console.error("Error loading contract data:", error.message);
      }
    };

    initializeWeb3();
  }, [agreementAddress]);

  const signAgreement = async (party) => {
    if (!contract || !account) return;

    try {
      setLoading(true);

      if (party === "partyA" && !isSignedByA) {
        await contract.methods.signByPartyA().send({ from: account });
        setIsSignedByA(true);
        notification.success({ message: "Signed as Party A successfully!" });
      } else if (party === "partyB" && !isSignedByB) {
        await contract.methods.signByPartyB().send({ from: account });
        setIsSignedByB(true);
        notification.success({ message: "Signed as Party B successfully!" });
      }
    } catch (error) {
      notification.error({
        message: "Error signing agreement",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Web 3.0 Agreement</Title>
      <Card style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
        <Text strong>Party A:</Text> <Text>{partyA}</Text>
        <br />
        <Text strong>Party B:</Text> <Text>{partyB}</Text>
        <br />
        <Text strong>Document:</Text> <Text>{document}</Text>
        <br />
        <Text strong>Agreement Status:</Text>{" "}
        <Text>
          {isSignedByA && isSignedByB
            ? "Complete"
            : isSignedByA
            ? "Signed by Party A, waiting for Party B"
            : isSignedByB
            ? "Signed by Party B, waiting for Party A"
            : "Incomplete"}
        </Text>
        <br />
        <div style={{ marginTop: "20px" }}>
          {loading ? (
            <Spin />
          ) : (
            <>
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                onClick={() => signAgreement("partyA")}
                disabled={isSignedByA || isSignedByB || account !== partyA}
              >
                Sign as Party A
              </Button>
              <Button
                type="primary"
                onClick={() => signAgreement("partyB")}
                disabled={isSignedByB || isSignedByA || account !== partyB}
              >
                Sign as Party B
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default App;
