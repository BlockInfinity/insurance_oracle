'use strict';

const request = require('request');
var chalk = require('chalk');
var ChildProcess = require('child_process');
var spawn = ChildProcess.spawn;
var _ = require('underscore');
var gulp = require('gulp');
require('../gulpfile');


var addresses;
let cmd;

// ######### entrypoint 
setInterval(checkAddresses, 3000);

// ######### 
function checkAddresses() {
    request('http://localhost:3001/getContractAddresses', (err, res, body) => {
        if (err) { return console.log(chalk.red("Couldnt connect to the contractDeployer: "+ err)); }
        let obj = JSON.parse(body);
        let newAddresses = obj.contractAddresses;
        if (obj.contractAddresses && !_.isEqual(newAddresses, addresses)) {
            addresses = newAddresses;

            console.log(`New contract addresses retrieved: ${JSON.stringify(addresses)}`);

            cmd = spawn("nodejs", ["oracle.js"], {
                env: {
                    Oracle: addresses.Oracle
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