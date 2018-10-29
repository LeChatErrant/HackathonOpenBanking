const config = require("../config.json");

const languageCode = config.languageCode;
const audioEncoding = config.audioEncoding;

exports.vocal = (input, sessionClient, session) => {
	return new Promise((resolve, reject) => {
		const request = {
			session: session,
			queryInput: {
				audioConfig: {
					languageCode: languageCode,
					audioEncoding: audioEncoding
				},
			},
			inputAudio: input,
			outputAudioConfig: {
				audioEncoding: `OUTPUT_AUDIO_ENCODING_LINEAR_16`,
			}
		};

		sessionClient
		.detectIntent(request)
		.then(responses => {
			const audioFile = responses[0].outputAudio;
			console.log(audioFile);
			require('fs').writeFileSync("./output.wav", audioFile);

			let	 result = responses[0].queryResult;
			console.log(`  Query: ${result.queryText}`);
			if (result.intent) {
				console.log(`  Intent: ${result.intent.displayName}\n`);
			} else {
				console.log(`  No intent matched.\n`);
			}
			console.log("Result:");
			console.log(result.fulfillmentText);
			console.log("\n");
			resolve(result.fulfillmentText);

		})
		.catch(err => {
			console.error('\nERROR:\n', err, '\n');
			resolve("Error");
		});
	});
}