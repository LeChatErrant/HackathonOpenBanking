const config = require("./config.json");
const dialogflow = require('dialogflow').v2beta1;

//configuration
const sessionClient = new dialogflow.SessionsClient();
const projectId = config.projetId;
const sessionId = "single user";
const session = sessionClient.sessionPath(projectId, sessionId);
const languageCode = config.languageCode;

exports.chatbot = (data) => {
	const text = "dab";
	const request = {
		session: session,
		queryInput: {
			text: {
				text: text,
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
		console.log(result);
		console.log("\n\n");
	})
	.catch(err => {
		console.error('\nERROR:\n', err, '\n\n');
	});
}