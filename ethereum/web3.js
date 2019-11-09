const privateKey = '1ba2d8f26f68b245c835e6bdf1719ed97c16afc3b743adc80c3aadf87e0d4659';
import Web3 from 'web3';
import HDWalletProvider from 'truffle-privatekey-provider';
const provider = new HDWalletProvider(privateKey, 'https://rinkeby.infura.io/v3/7e15ae1ae9464431bf5e87940787c971');
const web3 = new Web3(provider);

export default web3;