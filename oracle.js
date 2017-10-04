'use strict';
const request = require("request");
const path = require("path");
const fs = require("fs");
const Web3 = require("web3");
const oracleAddress = process.env.Oracle;


let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

if (!web3.isConnected()) {
    throw new Error("web3 is not connected.")
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

    let _airlinecode = result.args._airlinecode
    let _flightnumber = result.args._flightnumber
    let _originflightdate = result.args._originflightdate
    let _accesstoken = result.args._accessToken
    let cbaddress = result.args.cbaddress
    let id = result.args.id

    let abiPath = path.join(__dirname, 'insurance_contractDeployer', 'truffle', 'build', 'contracts', "FlightDelayContract.json");
    let abi_contract = fs.readFileSync(abiPath).toString();
    abi_contract = JSON.parse(abi_contract).abi;
    let contract = web3.eth.contract(abi_contract);
    let instanceFlightDelayContract = contract.at(cbaddress);


    let options = {
        url: 'https://developer.fraport.de/api/flights/1.0/flightDetails/' + _airlinecode + '/' + _flightnumber + '/' + _originflightdate,
        headers: {
            "Authorization": "Bearer " + _accesstoken
        }
    };

    function callback(error, response, body) {
        console.log("Requested fraport API. Body:", body)
        if (!error && response && response.statusCode == 200) {
            let info = JSON.parse(body);
            instanceFlightDelayContract.__callback(id, info[0].flight.flightStatus)
        }
    }

    request(options, callback);
}

module.exports = {
    requestApi: requestApi
}