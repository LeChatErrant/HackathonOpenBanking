const fs = require("fs");

function sleep(ms){
	return new Promise(resolve=>{
		setTimeout(resolve,ms);
	});
}

// Import module.
const main = async () => {
	const AudioRecorder = require('node-audiorecorder');

	// Options is an optional parameter for the constructor call.
	// If an option is not given the default value, as seen below, will be used.
	const options = {
		program: `sox`,			// Which program to use, either `arecord`, `rec`, and `sox`.
		device: null,			// Recording device to use.

		channels: 1,			// Channel count.
		bits: 16,				// Sample size. (only for `rec` and `sox`)
		encoding: `signed-integer`,	// Encoding type. (only for `rec` and `sox`)
		rate: 16000,			// Sample rate.
		type: `wav`,			// File type.

		// Following options only for `rec` and `sox` programs
		silence: 5,				// Time of silence in seconds before it stops recording.
		threshold: 0.5,			// Silence threshold.
		thresholdStart: null,	// Silence threshold to start recording, overrides threshold.
		thresholdStop: null,	// Silence threshold to stop recording, overrides threshold.
	};
	// Optional parameter intended for debugging.
	// The object has to implement a log and warn function.
	const logger = console;

	// Create an instance.
	let audioRecorder = new AudioRecorder(options, logger);
	const fileStream = fs.createWriteStream("./test.wav", { encoding: `binary` });
	// Start and write to the file.

	audioRecorder.start().stream().pipe(fileStream);
	audioRecorder.stream().on('data', function(chunk) {
		console.log(chunk);
	});
	await sleep(5000);
	audioRecorder.stop();
}

main();