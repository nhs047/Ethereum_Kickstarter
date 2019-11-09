const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const builtPath = path.resolve(__dirname, 'built');
fs.removeSync(builtPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(builtPath);

for(let contract in output){
    fs.outputJsonSync(
        path.resolve(builtPath, contract.replace(':', '')+'.json'),
        output[contract]
    );
}
