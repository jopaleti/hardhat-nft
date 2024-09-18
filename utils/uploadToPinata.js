const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath);
    // Filter the files in case there's a file that in not a .png, .jpg or .jpeg
    const files = fs
        .readdirSync(fullImagesPath)
        .filter((file) => /\b.png|\b.jpg|\b.jpeg/.test(file));
    // const files = fs.readdirSync(fullImagesPath);
    console.log({"files": files})
    // console.log(files)
    let responses = [];
    for (const fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        );
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        };
        try {
            const response = await pinata.pinFileToIPFS(
                readableStreamForFile,
                options
            );
            responses.push(response);
        } catch (error) {
            console.log(error);
        }
    }
    return { responses, files };
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}
module.exports = { storeImages, storeTokenUriMetadata };
