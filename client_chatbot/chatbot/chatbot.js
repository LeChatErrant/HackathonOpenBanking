const config = require("../config.json");
const dialogflow = require('dialogflow').v2beta1;
const fs = require('fs');
const text = require('./text').text;
const vocal = require('./vocal').vocal;

//configuration
const sessionClient = new dialogflow.SessionsClient();
const projectId = config.projectId;
const sessionId = "08KLA9wKN9djP3wnS3nd1sv8A1VQVRip";
const session = sessionClient.sessionPath(projectId, sessionId);

const record = () => {
	return new Promise((resolve, reject) => {
		console.log("Record started!");
		const cmd = spawn("arecord", [ "-c", "1", "-f", "S16_LE", "-r", "16000", "-t", "wav"]);
		resolve(cmd);
		cmd.stderr.on('data', data=>console.log(data.toString()));
	});
}

const stop = () => {
	prg.kill();
}

const play = (filePath) => {
	exec(`aplay ${filePath}`, (err, stdout, stderr) => {
		console.log("Play DONE");
		if (err) {
			console.log("\n\nERROR\n", err);
		} else {
			console.log(stdout);
		}
	});
}

exports.chatbot = async (data) => {
	await record(2);
	const recorded = fs.readFileSync("./record.wav")
	await vocal(filePath, sessionClient, session);
	play("output.wav");
}