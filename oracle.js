'use strict';
const request = require("request");
const path = require("path");
const fs = require("fs");
const Web3 = require("web3");
const oracleAddress = process.env.Oracle;

let urlNode = "http://testrpc:8545";
let web3 = new Web3(new Web3.providers.HttpProvider(urlNode));

console.log("process.env.nodeUrl",process.env.nodeUrl)
if (!web3.isConnected()) {
    throw new Error(`web3 is not connected to ${urlNode}`)
}

web3.eth.defaultAccount = web3.eth.accounts[0]

let abiPath = path.join(__dirname, 'insurance_contractDeployer', 'truffle', 'build', 'contracts', 'Oracle' + '.json');
let abi_contract = fs.readFileSync(abiPath).toString();
abi_contract = JSON.parse(abi_contract).abi;
let contract = web3.eth.contract(abi_contract);
let instanceOracle = contract.at(oracleAddress);

console.log("Connected to new Oracle instance: ", instanceOracle.address)

instanceOracle.Query(function(error, result) {
    if (!error) {
        console.log("Query received.")
        requestApi(result);
    } else { throw error; }
})

function requestApi(result) {

    let _date = result.args._date
    let _resortID = "13026";
    let _appKey = "9fbe3edc7b00b36b25595ff55a0c1540";
    let _appID = "5a2388f8";
    let cbaddress = result.args.cbaddress
    let id = result.args.id

    let abiPath = path.join(__dirname, 'insurance_contractDeployer', 'truffle', 'build', 'contracts', "BadWeatherContract.json");
    let abi_contract = fs.readFileSync(abiPath).toString();
    abi_contract = JSON.parse(abi_contract).abi;
    let contract = web3.eth.contract(abi_contract);
    let instanceBadWeatherContract = contract.at(cbaddress);


    let options = {
        url: 'https://api.weatherunlocked.com/api/snowreport/' + _resortID +'?app_id=' + _appID + '&app_key=' + _appKey,
        headers: {
            "Accept": "application/json"
        }
    };

    function callback(error, response, body) {
        console.log("Requested Weather API. Body:", body)
        if (!error && response && response.statusCode == 200) {
            let info = JSON.parse(body);
            instanceBadWeatherContract.__callback_weather(id, (parseInt(info.uppersnow_cm)*100))
        }
    }

    request(options, callback);
}

module.exports = {
    requestApi: requestApi
}
