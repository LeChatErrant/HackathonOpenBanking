'use strict';

const path = require('path');
const fs = require('fs');

//Configuration
const config = require('./config.json');

//Google api credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(config.googleApplicationCredentials);

//Socket.IO client
const io = require('socket.io-client');
var socket = io.connect(config.serverURL, {reconnect: true});
socket.on('connect', () => console.log("Connected!"));
socket.on('activate', data => require('./chatbot').chatbot(data));

//creating record dir
if (!fs.existsSync(config.recordDir)) {
	fs.mkdirSync(config.recordDir);
};