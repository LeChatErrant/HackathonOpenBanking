let config;
let dialogflow;
let fs;
let text;
let vocal;

let toggle = {toggle: true};

//configuration
let sessionClient;
let projectId;
let sessionId;
let session;

exports.init = () => {
	config = require('../config.json');
	dialogflow = require('dialogflow').v2beta1;
	fs = require('fs');
	text = require('./text').text;
	vocal = require('./vocal').vocal;

	sessionClient = new dialogflow.sessionClient();
	projectId = config.projectId;
	sessionId = "08KLA9wKN9djP3wnS3nd1sv8A1VQVRip";
	session = sessionClient.sessionPath(projectId, sessionId);
}

const rec = async (jaw) => {
	console.log("Starting the reply from the user...");
	await vocal("./vocal.wav", toggle, sessionClient, session, jaw);
	console.log("Reply from the user resolved!");
	if (toggle.toggle === true) {
		rec(jaw);
	}
}

exports.chatbot = async (socket, jaw, data) => {
	console.log("InMoov activated! Metadata: \n", data);

	toggle.toggle = true;
	socket.on('desactivate', () => {
		console.log("Received: desactivate");
		toggle.toggle = false
	});

	console.log("Initializing the conversation...");
	if (toggle.toggle === false) return;
	await text("loren ipsum ali baba", null, sessionClient, session, jaw);
	if (toggle.toggle === false) return;
	await text(data.name, "./vocal.wav", sessionClient, session, jaw);
	if (toggle.toggle === false) return;
	console.log("Initialisation resolved!");
	rec(jaw);
}