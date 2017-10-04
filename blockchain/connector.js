'use strict';

const path = require('path');
const fs = require('fs')
const Web3 = require("web3");
const pm = require("../processManager/processManager.js")
let web3;

try {
    // ##########################################################################################################
    // ################################ Connect to testrpc Blockchain ###########################################
    // ##########################################################################################################

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        // web3 = new Web3(new Web3.providers.HttpProvider("http://testrpcName:8545"));
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    if (!web3.isConnected()) {
        throw new Error("web3 is not connected.")
    }

    web3.eth.defaultAccount = web3.eth.accounts[0]

    // ##########################################################################################################
    // ################################ Load deployed Contracts from truffle reposiroty #########################
    // ##########################################################################################################

    let addresses = pm.getAddresses();
    let abiPath;
    let abi_contract;
    let contract;
    let instance;
    let pathContracts = path.join(__dirname, '..', 'insurance_contractDeployer', 'truffle', 'build', 'contracts');
    let files = fs.readdirSync(pathContracts);

    console.log("\n")
    for (let x in files) {
        let contractName = files[x].replace('.json', '');
        abiPath = path.join(__dirname, '..', 'insurance_contractDeployer', 'truffle', 'build', 'contracts', contractName + '.json');
        abi_contract = fs.readFileSync(abiPath).toString();
        // console.log(abi_contract)
        abi_contract = JSON.parse(abi_contract).abi;
        contract = web3.eth.contract(abi_contract);
        instance = contract.at(addresses[contractName]);
        web3[contractName] = instance;
        console.log(contractName, "with address ", web3[contractName].address, " is loaded.");
    }
    console.log("\n")

} catch (err) {
    console.log(err);
    throw new Error(err);
}

module.exports = web3;