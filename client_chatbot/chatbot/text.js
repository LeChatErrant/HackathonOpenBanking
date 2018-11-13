const fs = require('fs');
const exec = require("child_process").exec;
const path = require("path");
const config = require("../config.json");

const languageCode = config.languageCode;

const play = (filePath, jaw, jawController) => {
	return new Promise((resolve, reject) => {
		console.log("Play started");
		jaw.stdin.write(path.resolve(filePath) + "\n");
		jawController.stdout.once(data => {
			console.log("Play finished");
			resolve();
		});
		/*
		jaw.stdin.write("j\n");
		let child = exec(`aplay ${filePath}`);
		child.prependListener('exit', () => {
			jaw.stdin.write("s\n");
			console.log("Play finished");
			resolve();
		});
		*/
	});
}

exports.text = (input, filePath, sessionClient, session, jaw, jawController) => {
	return new Promise( (resolve, reject) => {
		const request = {
			session: session,
			queryInput: {
				text: {
					text: input,
					languageCode: languageCode,
				},
			}
		};

		if (filePath !== null) {
			request.outputAudioConfig = {
				audioEncoding: `OUTPUT_AUDIO_ENCODING_LINEAR_16`,
			}
		}

		sessionClient
		.detectIntent(request)
		.then(async responses => {
			let result = responses[0].queryResult;
			console.log(`  Query: ${result.queryText}`);
			if (result.intent) {
				console.log(`  Intent: ${result.intent.displayName}\n`);
			} else {
				console.log(`  No intent matched.\n`);
			}
			console.log("Result:");
			console.log(result.fulfillmentText);
			console.log("\n");
			if (filePath !== null) {
				fs.writeFileSync(filePath, responses[0].outputAudio);
				await play(filePath, jaw, jawController);
				resolve();
			} else {
				resolve();
			}
		})
		.catch(err => {
			console.error('\nERROR:\n', err, '\n');
			resolve("Error");
		});
	});
}
