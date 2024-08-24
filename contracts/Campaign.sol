// SPDX-License-Identifier: Unlicensed

pragma solidity >=0.7.0 <0.9.0;

contract CampaignCollection{
    address[] public deployedCampaigns;
    event campaignCreated(
        string title, 
        uint requiredAmt,
        address indexed owner, 
        address campaignAddress,
        string image, 
        string indexed category, 
        uint indexed timestamp
    );
    function createCampaign(
            string memory campaignTitle,
            uint campaignRequiredAmt,
            string memory imageURI, 
            string memory category,
            string memory campaignStory
            ) public
    {
        Campaign newCampaign = new Campaign(campaignTitle, campaignRequiredAmt, imageURI, campaignStory, msg.sender);
        deployedCampaigns.push(address(newCampaign));
        emit campaignCreated(
            campaignTitle, 
            campaignRequiredAmt, 
            msg.sender,
            address(newCampaign),
            imageURI, 
            category, 
            block.timestamp
        );
    }
}

contract Campaign{
    string public title;
    uint public requiredAmt;
    uint public receivedAmt;
    string public image;
    string public story;
    address payable public owner;

    event donorEvent(uint indexed amount, address indexed donor, uint indexed timestamp);

    constructor(string memory campaignTitle,
            uint campaignRequiredAmt,
            string memory imageURI, 
            string memory campaignStory,
            address campaignOwner)
        {
            title = campaignTitle;
            requiredAmt = campaignRequiredAmt;
            image = imageURI;
            story = campaignStory;
            owner = payable(campaignOwner);
        }

    function donate () payable public {
        require(requiredAmt > receivedAmt, "Enough funds collected!");
        receivedAmt += msg.value;
        owner.transfer(msg.value);
        emit donorEvent(msg.value, msg.sender, block.timestamp);
    }

}