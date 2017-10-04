var gulp = require('gulp');
var ChildProcess = require('child_process');
var spawn = ChildProcess.spawn;
var chalk = require('chalk');


gulp.task('run', function(cb) {

    let cmd = spawn("nodejs", ["./processManager/processManager.js"]);
    // let cmd = spawn("ls",["-l"]);

    cmd.stdout.on('data', function(data) {
        console.log(`${data}`);
    });

    cmd.stderr.on('data', function(data) {
        console.log(chalk.red(`stderr: ${data}`));
    });

    cmd.on('close', code => {
        if (code == 0) {
            cb();
        } else {
            cb('child process exited with code ' + code);
        }
    });
});
