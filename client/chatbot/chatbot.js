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

exports.init = () => {
	//This function litterally does nothing
	//It exists only for optimizations purpose
	//It makes scripts load before the first chatbot activation
}

const rec = async (jaw, toggle) => {
	console.log("Starting the reply from the user...");
	await vocal("./vocal.wav", toggle, sessionClient, session, jaw);
	console.log("Reply from the user resolved!");
	if (toggle.toggle === true) {
		rec(jaw, toggle);
	}
}

exports.chatbot = async (socket, data) => {
	console.log("InMoov activated! Metadata: \n", data);

	//Launch the jaw script
	let jaw = require('child_process').spawn("../inMoov/jaw/jaw.py", ["--unplugged"]);
	jaw.stdout.on('data', data => console.log(`JAW STDOUT :\n${data}\n`));
	jaw.stderr.on('data', data => console.log(`JAW STDERR:\n${data}\n`));

	let toggle = {toggle: true};
	socket.once('desactivate', async () => {
		console.log("Received: desactivate");
		toggle.toggle = false;
		await text("Par mes pouvoirs d'admin, je te reset!", null, sessionClient, session, jaw);
	});

	console.log("Initializing the conversation...");
	if (toggle.toggle === false) return;
	await text("loren ipsum ali baba", null, sessionClient, session, jaw);
	await text(data.name, "./vocal.wav", sessionClient, session, jaw);
	if (toggle.toggle === false) return;
	console.log("Initialisation resolved!");
	rec(jaw, toggle);
}
