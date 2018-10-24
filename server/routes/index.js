const express = require('express');
let router = express.Router();

//webhook
const webhook = require('./webhook').webhook;
router.options('/webhook', (req, res) => res.send());
router.post('/webhook', (req, res) => webhook(req, res));

//simple ping
router.get('/ping', (req, res) => res.send("I'm alive!"));

module.exports = router;