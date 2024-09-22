const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts }) {
    const { deployer } = await getNamedAccounts();

    // Basic NFT
    const basicNft = await ethers.getContractAt("BasicNft", deployer);
    const basicMintTx = await basicNft.mintNFT();
    await basicMintTx.wait(1);
    console.log(
        `Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`
    );

    // Random IPFS NFT
    const randomIpfsNft = await ethers.getContractAt("RandomIpfsNft", deployer);
    const mintFee = await randomIpfsNft.getMintFeed();
    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 300000); // 5 minutes
        randomIpfsNft.once("NftMinted", async function () {
            resolve();
        });
        const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
            value: mintFee.toString(),
        });
        const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);
        if (developmentChains.includes(network.name)) {
            const requestId = randomIpfsNft;
        }
    });
    // if
};
