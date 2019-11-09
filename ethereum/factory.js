import web3 from './web3';
import CampaignFactory from './built/CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x7a362132e2Dc1F8B797Def1438e12776b88ceA39'
);

export default instance;