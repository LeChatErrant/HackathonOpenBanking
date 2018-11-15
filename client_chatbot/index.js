'use strict';

const path = require('path');
const fs = require('fs');

//Configuration
const config = require('./config.json');

//Google api credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(config.googleApplicationCredentials);

//launch the jaw script
let jaw = require('child_process').spawn("../inMoov/jaw/jaw.py", ["--unplugged"]);
jaw.stdout.on('data', data => console.log(`JAW STDOUT :\n${data}\n`));
//jaw.stderr.on('data', data => console.log(`JAW STDERR :\n${data}\n`));

//Socket.IO client
const io = require('socket.io-client');
const chatbot = require('./chatbot/chatbot');
chatbot.init();
const launch = chatbot.chatbot;
var socket = io.connect(config.serverURL, {reconnect: true});
socket.on('connect', () => console.log("Connected!"));
socket.on('activate', data => launch(socket, jaw, data));

//creating record dir
if (!fs.existsSync(config.recordDir)) {
	fs.mkdirSync(config.recordDir);
};
