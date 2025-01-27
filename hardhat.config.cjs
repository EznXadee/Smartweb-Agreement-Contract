require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", 
      accounts: [
        '0x027cb77d306e153c10f69dab70833e1fcda00377a186603a7992152d6c87395a',
      ]
    }
  }
};
