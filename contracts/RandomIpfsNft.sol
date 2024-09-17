// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract RandomIpfsNft is VRFConsumerBaseV2 {
    /*
        1. When we mint NFT, we will trigger a Chainlink VRF call to get us a random number
        2. Using that number, we will get a random NFT
        3. Pug, Shiba Inu, St. Bernard
        -- Pug super rare
        -- Shiba sort of rare
        -- St. bernard common

        4. Users have to pay to mint a NFT
        5. The owner of the contract can withdraw the ETH
     */

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

    constructor(address vrfCoordinatorV2) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    }

    function requestNft() public{}   

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {}

    function tokenURI(uint256) public {}
}