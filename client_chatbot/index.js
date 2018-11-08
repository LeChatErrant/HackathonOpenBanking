'use strict';

const path = require('path');
const fs = require('fs');

//Configuration
const config = require('./config.json');

//Google api credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(config.googleApplicationCredentials);

//launch the jaw script
let jaw = require('child_process').spawn('python3', ["../inMoov/jaw/jaw.py"]);
jaw.stdout.on('data', data => console.log(`JAW STDOUT :\n${data}\n`));
jaw.stderr.on('data', data => console.log(`JAW STDERR :\n${data}\n`));
setInterval(() => {
	jaw.stdin.write("DAB\n");
}, 200);

//Socket.IO client
const io = require('socket.io-client');
const chatbot = require("./chatbot/chatbot").socket;
var socket = io.connect(config.serverURL, {reconnect: true});
socket.on('connect', () => console.log("Connected!"));
socket.on('activate', data => chatbot(socket, jaw, data));

//creating record dir
if (!fs.existsSync(config.recordDir)) {
	fs.mkdirSync(config.recordDir);
};
