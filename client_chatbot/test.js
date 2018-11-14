const spawn = require('child_process').spawn;

let jaw = require('child_process').spawn("../inMoov/jaw/lip_sinc.py");
let jawController = require('child_process').spawn("python3", ["../inMoov/jaw/jaw_control.py"]);
jawController.stdout.on('data', data => console.log(`JAWCONTROLLER STDOUT:\n${data}\n`));
jawController.stderr.on('data', data => console.log(`JAWCONTROLLER STDERR:\n${data}\n`));
jawController.stdin.write('./vocal.wav\n');