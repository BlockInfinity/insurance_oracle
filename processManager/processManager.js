const request = require('request');
var chalk = require('chalk');
var ChildProcess = require('child_process');
var spawn = ChildProcess.spawn;
var exec = ChildProcess.execSync;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var _ = require('underscore');
var gulp = require('gulp');
require('../gulpfile');


let addresses;


// ######### entrypoint 
setInterval(checkAddresses, 3000);

// ######### 
function checkAddresses() {
    request('http://localhost:3001/getContractAddresses', (err, res, body) => {
        if (err) { return console.log(err); }
        let obj = JSON.parse(body);
        let newAddresses = obj.contractAddresses;
        if (!_.isEqual(newAddresses, addresses)) {
            addresses = newAddresses;
            console.log(`New contract addresses retrieved: ${JSON.stringify(addresses)}`);
            if (gulp.tasks.runOracle) {
                console.log('gulpfile contains task!');
                gulp.start('runOracle');
            }
        } else {
            console.log(`Oracle is listening.`);
        }
    });
}

