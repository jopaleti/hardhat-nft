const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
    // const { deployer } = await getNamedAccounts();
    const basic = await deployments.get("BasicNft");
    const random = await deployments.get("RandomIpfsNft");
    const dynamic = await deployments.get("DynamicSvgNft");

    const basicNftDeployer = basic.address;
    const randomNftDeployer = random.address;
    const dynamicNftDeployer = dynamic.address;

    // Basic NFT
    const basicNft = await ethers.getContractAt("BasicNft", basicNftDeployer);
    const basicMintTx = await basicNft.mintNFT();
    await basicMintTx.wait(1);
    console.log(
        `Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`
    );

    // Dynamic SVG NFT
    const highValue = ethers.parseEther("4000");
    const dynamicSvgNft = await ethers.getContractAt(
        "DynamicSvgNft",
        dynamicNftDeployer
    );
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(
        highValue.toString()
    );
    await dynamicSvgNftMintTx.wait(1);
    console.log(
        `Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`
    );

    // Random IPFS NFT
    const randomIpfsNft = await ethers.getContractAt(
        "RandomIpfsNft",
        randomNftDeployer
    );
    const mintFee = await randomIpfsNft.getMintFeed();
    const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
        value: mintFee.toString(),
    });
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);
    await new Promise(async (resolve, reject) => {
        setTimeout(
            () => reject("Timeout: 'NFTMinted' event did not fire"),
            300000
        ); // 5 minutes
        randomIpfsNft.once("NftMinted", async function () {
            console.log(
                `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(
                    0
                )}`
            );
            resolve();
        }); const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);

        if (developmentChains.includes(network.name)) {
            const requestId = randomIpfsNftMintTxReceipt.logs[0].topics[1];
            const vrfCoordinatorV2Mock = await ethers.getContractAt(
                "VRFCoordinatorV2Mock",
                basicNftDeployer
            );

            // ERROR IS HERE.... BELOW...
            await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestId,
                randomIpfsNft.address
            );
        }
    });
    console.log(
        `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`
    );
};

module.exports.tags = ["all", "mint"];
