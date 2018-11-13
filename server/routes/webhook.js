const fs = require("fs");
const firebase = require('firebase');
const config = require('../config.json');

firebase.initializeApp(config.db);
let cache;

const getDb = (table) => {
	return new Promise((resolve, reject) => {
		firebase.database().ref(table).once('value').then(function(snapshot) {
			const db = snapshot.val();
			resolve(db);
		});
	});
}

const updateDb = (table, data) => {
	let ref = firebase.database().ref().child(table);
	ref.update(data);

};

const resa = (body, parameter, response) => {
	return new Promise((resolve, reject) => {
		const agenda = cache.calendar;

		const date = parameter.day + "/" + monthRef.indexOf(parameter.month).toString() + "/2018";
		console.log("Date asked: " + date);
		resolve();
	});
}

const monthRef = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];

const dispo = (body, parameter, response) => {
	return new Promise(async(resolve, reject) => {
		const agenda = cache.calendar;
		if (!agenda) {
			response.fulfillmentText = body.queryResult.fulfillmentMessages[1].text.text[0];
			response.outputContexts = body.queryResult.outputContexts;
			response.outputContexts[0].lifespanCount = 0;
		} else {
			response.fulfillmentText = body.queryResult.fulfillmentMessages[0].text.text[0] + "\n";
			agenda.forEach(x => {
				const date = x.date.split("/");
				const day = date[0];
				const month = monthRef[+date[1]];
				response.fulfillmentText += ` - Le ${day} ${month} à ${x.hour}.\n`;
			});
			response.fulfillmentText += "Souhaitez-vous que je répète?";
		}
		response.fulfillmentText = strParameters(response.fulfillmentText, parameter);
		resolve();
	});
}

const rendezvous = (body, parameter, response) => {
	return new Promise(async (resolve, reject) => {
		const db = await getDb("/conseillers/");
		const conseiller = db[parameter.conseiller];
		cache = conseiller;
		if (conseiller.state === 'disponible') {
			response.fulfillmentText = body.queryResult.fulfillmentMessages[0].text.text[0];
			response.outputContexts = body.queryResult.outputContexts;
			response.outputContexts[0].lifespanCount = 0;
		} else {
			response.fulfillmentText = body.queryResult.fulfillmentMessages[1].text.text[0];
		}
		resolve();
	});
}

const strParameters = (str, parameters) => {
	Object.keys(parameters).forEach(parameter => {
		console.log("Searching for " + "$" + parameter);
		str = str.replace("$" + parameter, parameters[parameter]);
	});
	return str;
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

exports.webhook = async (req, res) => {
	const body = req.body;
	console.log("BODY: ", body);
	const action = body.queryResult.action;
	console.log("ACTION: ", action);
	let parameters = {...body.queryResult.parameters}
	body.queryResult.outputContexts.forEach(x => {
		parameters = {...parameters, ...x.parameters};
	});

	console.log("PARAMETERS: ", parameters);
	let response = {};

	if (action === "input.welcome") {
		welcomeLogged(body, parameters, response);
	} else if (action === "replace") {
		simpleReplace(body, parameters, response);
	} else if (action === "rendezvous") {
		await rendezvous(body, parameters, response);
	} else if (action === "disponibilités") {
		await dispo(body, parameters, response);
	} else if (action === "reservation") {
		await resa(body, parameters, response);
	} else {
		unrecognizedAction(response);
	}
	res.send(response);
}