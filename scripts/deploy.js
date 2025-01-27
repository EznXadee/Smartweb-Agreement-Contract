import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
      const partyB = "0xa2Ca179BFb4869753C7d1B492CBA3f32AAF45D24"; 
    const documentContent = "This is a legally binding agreement between Party A and Party B.";
      const Agreement = await ethers.getContractFactory("Agreement");
    const agreement = await Agreement.deploy(partyB, documentContent);
    await agreement.waitForDeployment();
    console.log("Agreement contract deployed to:", agreement.target);
  }
  
  main()
    // eslint-disable-next-line no-undef
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      // eslint-disable-next-line no-undef
      process.exit(1);
    });