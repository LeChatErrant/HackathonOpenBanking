const fs = require("fs");
const firebase = require('firebase');
const config = require('../config.json');

firebase.initializeApp(config.db);

const getDb = (table) => {
	return new Promise((resolve, reject) => {
		firebase.database().ref(table).once('value').then(function(snapshot) {
			const db = snapshot.val();
			resolve(db);
		});
	});
}

const rendezvous = async (body, parameter, response) => {
	const db = await getDb("/conseillers/");
	console.log("DB\n", db);
	const conseiller = db[parameter.conseiller];
	console.log("CONSEILLER\n", conseiller);
}

const replaceParameters = (body, parameters) => {
	let str = body.queryResult.fulfillmentText;
	Object.keys(parameters).forEach(parameter => {
		console.log("Searching for " + "$" + parameter);
		str = str.replace("$" + parameter, parameters[parameter]);
	});
	return str;
}

const welcomeLogged = (body, parameters, response) => {
	response.fulfillmentText = replaceParameters(body, parameters);
}

const simpleReplace = (body, parameters, response) => {
	response.fulfillmentText = replaceParameters(body, parameters);
}

const unrecognizedAction = (response) => {
	response.fulfillmentText = "Error : Unrecognized action";
}

exports.webhook = (req, res) => {
	const body = req.body;
//	console.log("BODY: ", body);
	const action = body.queryResult.action;
	console.log("ACTION: ", action);
	const parameters = {...body.queryResult.parameters, ...body.queryResult.outputContexts[0].parameters};
	console.log("PARAMETERS: ", parameters);
	let response = {};

	if (action === "input.welcome") {
		welcomeLogged(body, parameters, response);
	} else if (action === "replace") {
		simpleReplace(body, parameters, response);
	} else if (action === "rendezvous") {
		rendezvous(body, parameters, response);
	} else {
		unrecognizedAction(response);
	}
	res.send(response);
}