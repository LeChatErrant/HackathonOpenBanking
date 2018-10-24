const test = (response) => {
	response.fulfillmentText = "Test worked!";
}

const unrecognizedAction = (response) => {
	response.fulfillmentText = "Error : Unrecognized action";
}

exports.webhook = (req, res) => {
	const body = req.body;
	const action = req.body.action;
	const parameters = body.queryResult.parameters;
	let response = {};

	if (action === "test") {
		test(response);
	} else {
		unrecognizedAction(reponse);
	}
	res.send(response);
}