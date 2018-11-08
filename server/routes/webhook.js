const fs = require("fs");

const replaceParameters = (body, parameters) => {
	let str = body.queryResult.fulfillmentText;
//	Object.keys(parameters).forEach(parameter => {
	for (let i = 0 ; i < Object.keys(parameters) ; i++) {
		str.replace("$" + Object.keys(parameters)[i], parameters[Object.keys(parameters)[i]]);
	};
	console.log(str);
	return str;
}

const welcomeLogged = (body, parameters, response) => {
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
	} else {
		unrecognizedAction(response);
	}
	res.send(response);
}