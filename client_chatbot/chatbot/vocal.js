const fs = require("fs");
const pump = require('pump');
const through2 = require('through2');
const config = require("../config.json");

const spawn = require('child_process').spawn;
const exec = require('child_process').execSync;

let prg;
let timer;

const record = () => {
	return new Promise((resolve, reject) => {
		console.log("Record started!");
		const cmd = spawn("arecord", [ "-D" ,"plughw:1", "-c", "1", "-f", "S16_LE", "-r", "16000", "-t", "wav"]);
		resolve(cmd);
		cmd.stderr.on('data', data=>console.log(data.toString()));
	});
}

const stop = () => {
	prg.kill();
}

const play = (filePath) => {
	return new Promise((resolve, reject) => {
		console.log("Play started");
		exec(`aplay ${filePath}`);
		console.log("Play finished");
		resolve();
		/*		exec(`aplay ${filePath}`, (err, stdout, stderr) => {
			console.log("Play DONE");
			if (err) {
				console.log("\n\nERROR\n", err);
			} else {
				console.log(stdout);
			}
			resolve();
		});*/
	});
}

class Timer {
	constructor(timeout, callback) {
		this.timeout = timeout;
		this.callback = callback;
		this.actual = 0;
	}

	start() {
		this.check = setInterval(() => {
			this.actual += 100;
			console.log(this.actual);
			if (this.actual >= this.timeout) {
				this.isFinished = true;
				clearInterval(this.check);
				console.log("TIMER ENDED");
				this.callback()
			}
		}, 100);
	}

	reset() {
		this.actual = 0;
	}

	finish() {
		this.isFinished = true;
		clearInterval(this.check);
		console.log("TIMER FORCE ENDED");
		this.callback();
	}

	stopWhen(obj, ref, state) {
		let tmp = setInterval(() => {
			if (obj[ref] === state) {
				clearInterval(tmp);
				this.finish();
				timer = undefined;
			}
		}, 100);
	}
}


const handleData = async (data, filePath, resolve, toggle) => {
	if (!timer) {
		timer = new Timer(2000, stop);
		timer.start();
		timer.stopWhen(toggle, "toggle", false);
	}
	if (data.recognitionResult) {
		timer.reset();
		console.log(
			`Intermediate transcript: ${data.recognitionResult.transcript}`
		);
		if (data.recognitionResult.isFinal === true) {
			console.log(data);
			console.log("FINAAAAAL");
			if (!timer.isFinished) {
				timer.finish();
			}
		}
	} else {
		if (data.queryResult) {
			let result = data.queryResult;
			console.log(`  Query: ${result.queryText}`);
			if (result.intent) {
				console.log(`  Intent: ${result.intent.displayName}\n`);
			} else {
				console.log(`  No intent matched.\n`);
			}
			console.log("Result:");
			console.log(result.fulfillmentText);
			console.log("\n");
		} else {
			fs.writeFileSync(filePath, data.outputAudio);
			await play(filePath);
			timer = undefined;
			resolve();
		}
	}
}

exports.vocal = (filePath, toggle, sessionClient, session) => {
	return new Promise(async (resolve, reject) => {
		const initialStreamRequest = {
			session: session,
			queryParams: {
				session: session,
			},
			queryInput: {
				audioConfig: {
					audioEncoding: config.audioEncoding,
					languageCode: config.languageCode
				},
				singleUtterance: true,
			},
			outputAudioConfig: {
				audioEncoding: `OUTPUT_AUDIO_ENCODING_LINEAR_16`,
			}
		};

		const detectStream = sessionClient
		.streamingDetectIntent()
		.on('error', console.error)
		.on('data', data => handleData(data, filePath, resolve, toggle));

		// Write the initial stream request to config for audio input.
		detectStream.write(initialStreamRequest);

		prg = await record();
		pump(
			prg.stdout,
			through2.obj((obj, _, next) => {
				next(null, {inputAudio: obj});
			}),
			detectStream
		);
	});
}