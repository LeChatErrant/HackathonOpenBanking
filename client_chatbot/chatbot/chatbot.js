const config = require("../config.json");
const dialogflow = require('dialogflow');
const text = require('./text').text;

//configuration
const sessionClient = new dialogflow.SessionsClient();
const projectId = config.projectId;
const sessionId = "08KLA9wKN9djP3wnS3nd1sv8A1VQVRip";
const session = sessionClient.sessionPath(projectId, sessionId);

exports.chatbot = async (data) => {
	const res = await text("dab", sessionClient, session);
}