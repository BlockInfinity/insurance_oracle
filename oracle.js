const web3 = require("./blockchain/connector.js");
const request = require("request");
const path = require("path");
const fs = require("fs");

const instanceOracle = web3.Oracle;

console.log("instanceOracle", instanceOracle.address)
instanceOracle.Query(function(error, result) {
    if (!error) {
        console.log("in Query listener")
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

    let abiPath = path.join(__dirname, 'insurance_contractDeployer', 'truffle','build','contracts', "FlightDelayContract.json");
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
        console.log("body",body)
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
