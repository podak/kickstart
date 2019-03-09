import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !=='undefined') {
    // we are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
} else {
    // we are on the server *OR* the user is not runnung metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/6a5f9c4d13b54d2e97015ae6e8803ec3'
    );
    web3 = new Web3(provider);
}

export default web3;