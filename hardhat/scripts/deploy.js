const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { BINNADEVS_CONTRACT_ADDRESS} = require("../constants");

async function main() {
  // Address of the Binna Devs NFT contract. 
  // Used to initialize the IBinnaDevs interface.
  const binnaDevsNFTContract = BINNADEVS_CONTRACT_ADDRESS;

  // ContractFactory in ethers.js is an abstraction used to deploy new smart contracts
  const binnaDevsToken = await ethers.getContractFactory("BinnaDevToken");
  
  // deploy the contract
  const deployedBinnaDevsTokenContract = await binnaDevsToken.deploy(binnaDevsNFTContract);

  // wait for the contract to be deployed
  await deployedBinnaDevsTokenContract.deployed();

  // print the address of the deployed contract
  console.log(`BinnaDevs Token Contract Address => ${deployedBinnaDevsTokenContract.address}`);
}

// Call the main function and catch if there is any error
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
