const config = require("../config.json");
const dialogflow = require('dialogflow').v2beta1;
const fs = require('fs');
const text = require('./text').text;
const vocal = require('./vocal').vocal;

let toggle = {toggle: true};

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
	await text("C'est l'heure du d-d-demo days", "./demoDay.wav", sessionClient, session, jaw);
	if (toggle.toggle === false) return;
	await text("loren ipsum ali baba", null, sessionClient, session, jaw);
	if (toggle.toggle === false) return;
	await text(data.name, "./vocal.wav", sessionClient, session, jaw);
	if (toggle.toggle === false) return;
	console.log("Initialisation resolved!");
	rec(jaw);
}