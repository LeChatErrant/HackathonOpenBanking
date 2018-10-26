var record = require('node-record-lpcm16')
var fs = require('fs')

var file = fs.createWriteStream('test.wav', { encoding: 'binary' })

record.start().pipe(file);
console.log("Started...");

// Stop recording after three seconds
setTimeout(function () {
	record.stop()
	console.log("Stopped...");
}, 3000)