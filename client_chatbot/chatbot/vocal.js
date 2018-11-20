const fs = require("fs");
const pump = require('pump');
const through2 = require('through2');
const path = require('path');
const config = require("../config.json");

const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

let prg;
let timer;

const record = () => {
	return new Promise((resolve, reject) => {
		console.log("Record started!");
		const cmd = spawn("arecord", [ "-D" ,"plughw:0", "-c", "1", "-f", "S16_LE", "-r", "16000", "-t", "wav"]);
		cmd.stderr.on('data', data=>console.log(data.toString()));
		resolve(cmd);
	});
}

const stop = () => {
	prg.kill();
}

const play = (filePath, jaw) => {
	return new Promise((resolve, reject) => {
		console.log("Play started");
		jaw.stdin.write(path.resolve(filePath) + "\n");
		jaw.stdout.once('data', data => {
			console.log("Play finished");
			resolve();
		});
	});
}

class Timer {
	constructor(timeout, callback) {
		this.timeout = timeout;
		this.callback = callback;
		this.actual = 0;
		this.isStarted = false;
		this.lifetime = 50;
		this.lifetimeCount = 0;
		this.lifetimeCheck = setInterval(() => {
			this.lifetimeCount += 10;
			console.log("Timer actual lifetime: " + this.lifetimeCount.toString());
			if (this.lifetimeCount >= this.lifetime) {
				this.isStarted = true;
				this.finish();
			}
		}, 10000);
	}

	start() {
		console.log("Started timer");
		this.isStarted = true;
		this.check = setInterval(() => {
			this.actual += 100;
			console.log(this.actual);
			if (this.actual >= this.timeout) {
				this.finish();
			}
		}, 100);
	}

	reset() {
		this.actual = 0;
	}

	finish() {
		this.isFinished = true;
		if (this.tmp) {
			console.log("CLearing tmp");
			clearInterval(this.tmp);
		}
		clearInterval(this.check);
		clearInterval(this.lifetimeCheck);
		console.log("TIMER FORCE ENDED");
		this.callback();
	}

	stopWhen(obj, ref, state) {
		this.tmp = setInterval(() => {
			if (obj[ref] === state) {
				clearInterval(this.tmp);
				this.tmp = undefined;
				console.log("stopWhen finished");
				this.finish();
				timer = undefined;
			}
		}, 100);
	}
}

const aborted = async (resolve, jaw) => {
	timer.finish();
	await play("default.wav", jaw);
	timer = undefined;
	resolve();
}

let music;

const handleData = async (data, filePath, resolve, toggle, jaw) => {
	console.log("toggle state: ", toggle.toggle);
	if (toggle.toggle === false) {
		resolve();
		return;
	}
	if (!timer.isStarted) {
		timer.start();
	}
	if (toggle.toggle === false) {
		resolve()
		return;
	};
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
				aborted(resolve, jaw);
			}
			console.log("Output contexts: ");
			console.log(result.outputContexts.map(x => x.name.split("/")[x.name.split('/').length-1]));
			console.log("Result:");
			console.log(result.fulfillmentText);
			if (result.fulfillmentText.indexOf("Rap god") >= 0) {
				music = "../inMoov/jaw/sample/Rap_God.wav";
			}
			if (result.fulfillmentText.indexOf("Queen") >= 0) {
				music = "../inMoov/jaw/sample/Queen.wav";
			}
			console.log("\n");
		} else {
			fs.writeFileSync(filePath, data.outputAudio);
			await play(filePath, jaw);
			if (music !== false) {
				await play(music, jaw);
			}
			timer = undefined;
			resolve();
		}
	}
}

exports.vocal = (filePath, toggle, sessionClient, session, jaw) => {
	return new Promise(async (resolve, reject) => {
		music = false;
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
		.on('error', (e) => {
			console.error("ERROR IN STREAMDETECTINTENT: ", e);
			aborted(resolve, jaw);
			timer = undefined;
		})
		.on('data', data => handleData(data, filePath, resolve, toggle, jaw));

		// Write the initial stream request to config for audio input.
		detectStream.write(initialStreamRequest);

		try {
			prg = await record();
		} catch (e) {
			aborted(resolve, jaw);
			timer = undefined;
			return;
		}
		timer = new Timer(2000, stop);
		timer.stopWhen(toggle, "toggle", false);
		pump(
			prg.stdout,
			through2.obj((obj, _, next) => {
				next(null, {inputAudio: obj});
			}),
			detectStream
		);
	});
}