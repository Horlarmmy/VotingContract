const { ethers } = require("hardhat");

async function main() {
  const Voting = await ethers.deployContract("Voting", [["Candidate1", "Candidate2", "Candidate3"]]);;
  await Voting.deployed();

  console.log(`Voting Contract was deployed to ${Voting.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});