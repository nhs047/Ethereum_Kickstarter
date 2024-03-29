pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] public deploymentCampaigns;
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deploymentCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaign() public view returns(address[]){
        return deploymentCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests; 
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    //address[] public approvers;
    uint public approversCount;
    
    constructor(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public minimumval payable{
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    modifier minimumval() {
        require(msg.value > minimumContribution);
         _;
    }
    
    function createRequest(string description, uint value, address recipient) 
        public restricted {
            Request memory newRequest = Request({
                description: description,
                value: value,
                recipient: recipient,
                complete: false,
                approvalCount: 0
            });
            requests.push(newRequest);
        }
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount>(request.approvalCount/2));
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
  
    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }
    
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
        
}