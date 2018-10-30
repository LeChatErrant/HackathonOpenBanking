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

exports.chatbot = async (data) => {
	await vocal("./vocal.wav", sessionClient, session);
}