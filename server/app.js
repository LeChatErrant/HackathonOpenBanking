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

//Socket.IO server
const io = require('socket.io')(httpsServer);
io.on('connection', function(socket){
	console.log('A new user connected\n');
	socket.on('disconnect', () => console.log("A user disconnected\n"));

	//Testing purpose only, to delete before release
	var stdin = process.openStdin();
	let toggle = false;
	stdin.on('data', chunk => {
		if (toggle === false) {
			socket.emit('activate', {name: "Guillaume"});
			console.log("Chatbot activated!");
			toggle = true;
		} else {
			socket.emit('desactivate');
			console.log("Chatbot desactivated!");
			toggle = false;
		}
	});
});