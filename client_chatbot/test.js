const spawn = require('child_process').spawn;

let jaw = spawn("../inMoov/jaw/lip_sinc.py", ["2>", "/dev/null", "|", "python3", "../inMoov/jaw/jaw_control.py"]);
jaw.stdout.on('data', data => console.log(`JAW STDOUT :\n${data}\n`));
jaw.stderr.on('data', data => console.log(`JAW STDERR :\n${data}\n`));

