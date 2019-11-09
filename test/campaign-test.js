const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider())

const compiledCampaign = require('../ethereum/built/Campaign.json');
const compiledCampaignFactory = require('../ethereum/built/CampaignFactory.json');

let accounts, factory, campaignAddress, campaign;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
        .deploy({ data: compiledCampaignFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });
    
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });


    [campaignAddress] = await factory.methods.getDeployedCampaign().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    )
})

describe('campaign', () => {
    it('deploy a contract', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it('manager', async() => {
        assert.equal(await campaign.methods.manager().call(),accounts[0]);
    });
    it('contribution', async() => {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '101'
            });
            const isContribuor = await campaign.methods.approvers(accounts[1]).call();
            assert(isContribuor);
        
    })
    it('minimum contribution', async() => {
        try{
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '0'
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
        
    })
    it('manager requisition', async() => {
        await campaign.methods.createRequest('ddd', '3000', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call()
        assert.equal(request.description, 'ddd');
        
    })

    it('process request', async() => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });
        
        await campaign.methods.createRequest('ddd', web3.utils.toWei('5','ether'), accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance)
        console.log(balance);
        assert(balance > 104)
    })
})
