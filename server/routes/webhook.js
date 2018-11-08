const fs = require("fs");

const welcomeLogged = (body, response) => {
	console.log(body);
	fs.writeFileSync("./test.json", body);
	response.fulfillmentText = "Nickel, ca marche bien!";
}

const unrecognizedAction = (response) => {
	response.fulfillmentText = "Error : Unrecognized action";
}

exports.webhook = (req, res) => {
	const body = req.body;
//	console.log("BODY: ", body);
	const action = body.queryResult.action;
	console.log("ACTION: ", action);
	const parameters = {...body.queryResult.parameters, ...body.outputContexts[0].parameters.name};
	console.log("PARAMETERS: ", parameters);
	let response = {};

	if (action === "input.welcome") {
		welcomeLogged(body, response);
	} else {
		unrecognizedAction(response);
	}
	res.send(response);
}