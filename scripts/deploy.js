import pkg from 'hardhat';
import process from 'process';  // Ensure process is available

const { ethers } = pkg;

async function main() {
    // Get the contract factory for the Agreement contract
    const Agreement = await ethers.getContractFactory("Agreement");

    // Deploy the contract
    const agreement = await Agreement.deploy("Your initial agreement text here!");
    // Log the agreement object to inspect its structure
    console.log("Agreement object:", agreement);

    // If the deployment transaction exists, wait for it to be mined
    if (agreement.deployTransaction) {
        await agreement.deployTransaction.wait();
        console.log("Contract deployed to:", agreement.address);
    } else {
        console.log("No deployTransaction found. Contract might have deployed automatically.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
