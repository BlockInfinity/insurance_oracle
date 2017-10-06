'use strict';

const request = require('request');
var chalk = require('chalk');
var ChildProcess = require('child_process');
var spawn = ChildProcess.spawn;
var _ = require('underscore');
var gulp = require('gulp');
require('../gulpfile');

let host;
if (process.env.nodeUrl.includes("localhost")) {
    host = "localhost";
} else {
    host = "contractdeployer";
}


var addresses;
let cmd;

// ######### entrypoint 
setInterval(checkAddresses, 3000);

// ######### 
function checkAddresses() {
    request('http://' + host + ':3001/getContractAddresses', (err, res, body) => {
        if (err) { return console.log(chalk.red("Couldnt connect to the contractDeployer: " + err)); }
        let obj = JSON.parse(body);
        let newAddresses = obj.contractAddresses;
        if (obj.contractAddresses && !_.isEqual(newAddresses, addresses)) {
            addresses = newAddresses;

            console.log(`New contract addresses retrieved: ${JSON.stringify(addresses)}`);

            // todo kein subprocess 
            cmd = spawn("/usr/local/bin/node", ["oracle.js"], {
                env: {
                    Oracle: addresses.Oracle,
                    nodeUrl: process.env.nodeUrl
                }
            });

            cmd.stdout.on('data', function(data) {
                console.log(`${data}`);
            });

            cmd.stderr.on('data', function(data) {
                console.log(chalk.red(`stderr: ${data}`));
            });

            cmd.on('close', code => {
                if (code == 0) {
                    console.log("oracle closed.")
                } else {
                    console.log('child process exited with code ' + code);
                }
            });


        } else {
            console.log(`Oracle is listening.`);
        }
    });
}