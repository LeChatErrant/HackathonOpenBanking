const config = require("../config.json");

const languageCode = config.languageCode;

exports.text = (input, sessionClient, session) => {
	return new Promise((resolve, reject) => {
		const request = {
			session: session,
			queryInput: {
				text: {
					text: input,
					languageCode: languageCode,
				},
			},
		};

		sessionClient
		.detectIntent(request)
		.then(responses => {
			let	 result = responses[0].queryResult;
			console.log(`  Query: ${result.queryText}`);
			if (result.intent) {
				console.log(`  Intent: ${result.intent.displayName}\n`);
			} else {
				console.log(`  No intent matched.\n`);
			}
			console.log("Result:");
			console.log(result.fulfillmentText);
			console.log("\n\n");
			resolve(result.fulfillmentText);
		})
		.catch(err => {
			console.error('\nERROR:\n', err, '\n\n');
			resolve("Error");
		});
	});
}