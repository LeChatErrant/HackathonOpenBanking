const fs = require("fs");
const exec = require('child_process').exec;

function sleep(ms){
	return new Promise(resolve=>{
		setTimeout(resolve,ms);
	});
}

// Import module.
const main = async () => {
	exec("arecord -c 1 -r 16000 -t wav -D plughw:1 -d 5 test.wav", (err, stdout, stderr) => {
		if (err) {
			console.log("\n\nERROR\n", err);
		} else {
			console.log(stdout);
		}
	});

}

main();