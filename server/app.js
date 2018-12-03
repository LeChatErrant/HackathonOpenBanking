'use strict';

const fs = require('fs');

//Configuration
const config = require('./config.json');

//Express server
const express = require('express');
const express_session = require('express-session');
const bodyparser = require('body-parser');
const routes = require('./routes/index');

const app = express();
const port = config.port;

//Express middlewares
app.set('trust proxy', 1);
app.use(express_session({ secret: config.cookieSeed, resave: false, saveUninitialized: true }));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use((req, res, next) => {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Set-Cookie, *'
	});
	next()
});

//HTTPS handling
const https = require('https');
const certPath = config.certPath;
const keyPath = config.keyPath;
const httpsServer = https.createServer({
	key: fs.readFileSync(keyPath),
	cert: fs.readFileSync(certPath)
}, app).listen(port);
console.log(`Listening on ${port} with HTTPS...`);

//ROUTING
app.use('/', routes);
app.post('/FaceRecognition', (req, res) => {
	process.stdin.emit("data", req.body.result);
	res.send();
});

//Socket.IO server
let socket;
const io = require('socket.io')(httpsServer);

let toggle = false;
io.on('connection', function(sock) {
	socket = sock;
	console.log('A new user connected\n');
	socket.once('disconnect', () => {
		console.log("A user disconnected\n")
		socket = undefined;
		toggle = false;
	});
});

//Testing purpose only, to delete before release
//let stdin = process.openStdin();
process.stdin.on('data', chunk => {
	if (!socket) {
		console.log("No client connected!");
		return;
	}
	if (toggle === false) {
		if (chunk.length <= 1) {
			console.log("Enter a name for the user, please");
		} else {
			socket.emit('activate', {name: chunk});
			console.log("Chatbot activated!");
			toggle = true;
		}
	} else {
		socket.emit('desactivate');
		console.log("Chatbot desactivated!");
		toggle = false;
	}
});