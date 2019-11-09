const campaignFactory = require('./built/CampaignFactory.json')
const privateKey = '1ba2d8f26f68b245c835e6bdf1719ed97c16afc3b743adc80c3aadf87e0d4659';
const Web3 = require('web3');
const HDWalletProvider = require('truffle-privatekey-provider');
const provider = new HDWalletProvider(privateKey, 'https://rinkeby.infura.io/v3/7e15ae1ae9464431bf5e87940787c971');
const web3 = new Web3(provider);




const deploy = async () =>{
    const accounts = await web3.eth.getAccounts();
    console.log('contract deployed from ', accounts[0]);
    const inbox = await new web3.eth.Contract(JSON.parse(campaignFactory.interface))
    .deploy({ data: '0x'+campaignFactory.bytecode })
    .send({from: accounts[0], gas: '1000000'})
    console.log('contract address (Factory): ', inbox.options.address);
}

deploy();