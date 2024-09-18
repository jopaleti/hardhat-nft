const { network, ethers } = require("hardhat");
const {
    developmentChains,
    networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {storeImages} = require("../utils/uploadToPinata")

const imagesLocation = "./images/randomNft"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let tokenUris
    //  Get the IPFS hashes of our images
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    /*
        1. With our own IPFS node. https://docs.ipfs.io/
        2. Pinata
        3. nft.storage https://nft.storage/
    */

    let vrfCoordinatorV2Address, subscriptionId;

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContractAt(
            "VRFCoordinatorV2Mock"
        );
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const tx = await vrfCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait(1);
        subscriptionId = txReceipt.events[0].args.subId;
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

    log("----------------------------------------------");
    await storeImages(imagesLocation)
    // const args = [
    //     vrfCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[chainId].mintFee,
    //     networkConfig[chainId].callbackGasLimit,
    //     // tokenUris
    //     networkConfig[chainId].mintFee,
    // ];
};

async function handleTokenUris() {
    tokenUris = []
    // Store the images in IPFS
    // Store the metadata in IPFS

    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]