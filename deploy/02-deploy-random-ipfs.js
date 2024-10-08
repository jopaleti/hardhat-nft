const { network, ethers } = require("hardhat");
const {
    developmentChains,
    networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
    storeImages,
    storeTokenUriMetadata,
} = require("../utils/uploadToPinata");

const imagesLocation = "./images/randomNft";

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100,
        },
    ],
};

let tokenUris = [
    "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
    "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
    "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
];

const FUND_AMOUNT = "1000000000000000000000";

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    //  Get the IPFS hashes of our images
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris();
    }

    /*
        1. With our own IPFS node. https://docs.ipfs.io/
        2. Pinata
        3. nft.storage https://nft.storage/
    */
    
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;

    if (chainId == 31337) {
        const vrf = await deployments.get("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Mock = await ethers.getContractAt(
            "VRFCoordinatorV2Mock",
            vrf.address
        );
        // vrfCoordinatorV2Address = vrfCoordinatorV2Mock.runner.address;
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.target;
        const tx = await vrfCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait(1);
        // subscriptionId = txReceipt.events[0].args.subId;
        subscriptionId = BigInt(txReceipt.logs[0].topics[1]);

        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(
            subscriptionId,
            FUND_AMOUNT
        );
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

    log("----------------------------------------------");
    // await storeImages(imagesLocation)
    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["callbackGasLimit"],
        tokenUris,
        networkConfig[chainId]["mintFee"],
    ];

    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("----------------------------------------------");
    if (chainId == 31337) {
        await vrfCoordinatorV2Mock.addConsumer(
            subscriptionId,
            randomIpfsNft.address
        );
    }
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...");
        await verify(randomIpfsNft.address, args);
    }
};

async function handleTokenUris() {
    tokenUris = [];
    // Store the images in IPFS
    // Store the metadata in IPFS
    const { responses: imageUploadResponses, files } = await storeImages(
        imagesLocation
    );
    for (const imageUploadResponseIndex in imageUploadResponses) {
        // Create metadata
        // Upload metadata
        let tokenUriMetadata = { ...metadataTemplate };
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(
            ".png",
            ""
        );
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
        console.log(`Uploading ${tokenUriMetadata.name}...`);
        // Store the JSON to pinata ipfs
        const metadataUploadResponse = await storeTokenUriMetadata(
            tokenUriMetadata
        );
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
    }

    console.log("Token URIS Uploaded! They are:");
    console.log(tokenUris);
    return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];
