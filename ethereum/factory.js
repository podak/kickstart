import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    //'0x8CCB43bB8EC7355D3a1e580334652D3Cfcc007C0'
    '0xe88600719712f2f2ca05288f5fc5F41f5aEb2B30'
);

export default instance;