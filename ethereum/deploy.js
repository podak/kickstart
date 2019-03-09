const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('./build/CampaignFactory.json')

// TODO: try to access with a private key
// TODO: write the mnomonic/key in a separate .gitignore file
const provider = new HDWalletProvider(
    'swamp drum fiber casual broom sample false girl nice news raise credit',
    'https://rinkeby.infura.io/v3/6a5f9c4d13b54d2e97015ae6e8803ec3'
);

const web3 = new Web3(provider);

// define a function in order to use async / await sintax
const delploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: '0x' + compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    console.log('Contract deployed to', result.options.address);

}

delploy();