const config = require("../config.json");
const dialogflow = require('dialogflow');
const exec = require('child_process').exec;
const fs = require('fs');
const text = require('./text').text;
const vocal = require('./vocal').vocal;

//configuration
const sessionClient = new dialogflow.SessionsClient();
const projectId = config.projectId;
const sessionId = "08KLA9wKN9djP3wnS3nd1sv8A1VQVRip";
const session = sessionClient.sessionPath(projectId, sessionId);

const record = (sec) => {
	return new Promise((resolve, reject) => {
		exec(`arecord -c 1 -f S16_LE -r 16000 -t wav -D plughw:1 -d ${sec} record.wav`, (err, stdout, stderr) => {
			console.log("Record DONE");
			if (err) {
				console.log("\n\nERROR\n", err);
				resolve();
			} else {
				console.log(stdout);
				resolve();
			}
		});
	});
}

exports.chatbot = async (data) => {
	//	const res = await text("dab", sessionClient, session);
	await record(2);
	const recorded = fs.readFileSync("./record.wav")
	await vocal(recorded, sessionClient, session);
}