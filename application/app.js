const express = require("express");
const path = require("path");
const fs = require('fs');
const config = require("./config.json");

const app = express();
app.use('/', express.static(__dirname + '/dist/banque/'));

app.get("/ping", (req, res) => res.send("I'm alive!"));

//HTTPS handling
const https = require('https');
const certPath = config.certPath;
const keyPath = config.keyPath;
const port = config.port;
const httpsServer = https.createServer({
	key: fs.readFileSync(keyPath),
	cert: fs.readFileSync(certPath)
}, app).listen(port);
console.log(`Listening on ${port} with HTTPS...`);