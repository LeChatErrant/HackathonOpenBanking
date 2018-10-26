const test = (response) => {
	response.fulfillmentText = "Test worked!";
}

const unrecognizedAction = (response) => {
	response.fulfillmentText = "Error : Unrecognized action";
}

exports.webhook = (req, res) => {
	const body = req.body;
//	console.log("BODY: ", body);
	const action = body.queryResult.action;
	console.log("ACTION: ", action);
	const parameters = body.queryResult.parameters;
	console.log("PARAMETERS: ", parameters);
	let response = {};

	if (action === "test") {
		test(response);
	} else {
		unrecognizedAction(response);
	}
	res.send(response);
}