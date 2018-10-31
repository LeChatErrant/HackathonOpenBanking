const config = require("../config.json");

const languageCode = config.languageCode;

const play = (filePath) => {
	return new Promise((resolve, reject) => {
		exec(`aplay ${filePath}`, (err, stdout, stderr) => {
			console.log("Play DONE");
			if (err) {
				console.log("\n\nERROR\n", err);
			} else {
				console.log(stdout);
			}
			resolve();
		});
	});
}

exports.text = (input, filePath, sessionClient, session) => {
	return new Promise( (resolve, reject) => {
		const request = {
			session: session,
			queryInput: {
				text: {
					text: input,
					languageCode: languageCode,
				},
			},
			outputAudioConfig: {
				audioEncoding: `OUTPUT_AUDIO_ENCODING_LINEAR_16`,
			}
		};

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
			fs.writeFile(filePath, responses[0].outputAudio);
			await play(filePath)
			resolve();
		})
		.catch(err => {
			console.error('\nERROR:\n', err, '\n');
			resolve("Error");
		});
	});
}