require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28", // Match your contract's Solidity version
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Ensure this matches your local node
    },
  },
};
