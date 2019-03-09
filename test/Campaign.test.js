const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('./../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('./../ethereum/build/Campaign.json');

beforeEach(async () => {
    this.accounts = await web3.eth.getAccounts();
    this.factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: this.accounts[0], gas: '1000000' });

    await this.factory.methods.createCampaign('100')
        .send({
            from: this.accounts[0],
            gas: '1000000'
        });

    // ES6: assign to the variable the first record of the array
    [this.campaignAddress] = await this.factory.methods.getDeployedCampaigns().call();
    this.campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        this.campaignAddress // when a addressed is passed, it retrieves an existing contract
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(this.factory.options.address);
        assert.ok(this.campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await this.campaign.methods.manager().call();
        assert.equal(this.accounts[0], manager);
    });

    it('allows to people to contribute money and marks them as approvers', async () => {
        await this.campaign.methods.contribute().send({
            value: '200',
            from: this.accounts[1]
        });
        const isContributor = await this.campaign.methods.approvers(this.accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await this.methods.contribute().send({
                value: 5,
                from: this.accounts[1]
            });
            assert(false);
        }
        catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await this.campaign.methods
            .createRequest('Buy batteries', '100', this.accounts[2])
            .send({
                from: this.accounts[0],
                gas: '1000000'
            });
        const request = await this.campaign.methods.requests(0).call();

        assert.equal('Buy batteries', request.description);
    });

    it('processes request', async () => {
        await this.campaign.methods.contribute().send({
            from: this.accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await this.campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), this.accounts[1])
            .send({ from: this.accounts[0], gas: 1000000 });

        await this.campaign.methods
            .approveRequest(0)
            .send({ from: this.accounts[0], gas: 1000000 });

        await this.campaign.methods.finalizeRequest(0).send({
            from: this.accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(this.accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104)
    });
});