// const { assert } = require("chai");
// const { network, deployments, ethers } = require("hardhat");
// const { developmentChains } = require("../../helper-hardhat-config");

// !developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("Basic NFT Unit Tests", function () {
//           let basicNft, deployer;

//           beforeEach(async () => {
//               accounts = await ethers.getSigners();
//               deployer = accounts[0];
//               await deployments.fixture("basicnft");
//               //   Get the deployed BasicNft contract
//               const BasicNftDeployment = await deployments.get("BasicNft");
//               // Getting the contract address
//               const contractAddress = BasicNftDeployment.address;

//               basicNft = await ethers.getContractAt(
//                   "BasicNft",
//                   contractAddress
//               );
//               console.log("{ basicNFT: basicNft }");
//               console.log(basicNft);
//           });

//           describe("Constructor", () => {
//               it("Initializes the NFT correctly", async () => {
//                   const name = await basicNft.name();
//                   const symbol = await basicNft.symbol();
//                   const tokenCounter = await basicNft.getTokenCounter();
//                   assert.equal(name, "Dogie");
//                   assert.equal(symbol, "Dog");
//                   assert.equal(tokenCounter.toString(), "0");
//               });
//           });

//           // test02
//           describe("Mint NFT", () => {
//               beforeEach(async () => {
//                   const txResponse = await basicNft.mintNFT();
//                   await txResponse.wait(1);
//               });
//               it("Allows users to mintNFT and updates appropriately", async () => {
//                   const tokenURI = await basicNft.tokenURI(0);
//                   const tokenCounter = await basicNft.getTokenCounter();

//                   assert.equal(tokenCounter.toString(), "1");
//                   assert.equal(tokenURI, await basicNft.TOKEN_URI());
//               });
//               it("Show the correct balance and owner of an NFT", async () => {
//                   const deployerAddress = deployer.address;
//                   const deployerBalance = await basicNft.balanceOf(
//                       deployerAddress
//                   );
//                   const owner = await basicNft.ownerOf("0");

//                   assert.equal(deployerBalance.toString(), "1");
//                   assert.equal(owner, deployerAddress);
//               });
//           });
//       });
