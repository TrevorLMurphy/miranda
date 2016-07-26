var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var brain = require('./brain');
var app = express();

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.listen(process.env.PORT || 5000);

app.get('/', function(req, res) {
	res.send('The server is OK.');
});

app.get('/webhook', function(req, res) {
	if (req.query['hub.mode'] === 'subscribe' &&
		req.query['hub.verify_token'] === 'miranda_verify') {
		console.log("Validating webhook");
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
});

app.post('/webhook', function(req, res) {
	var events = req.body.entry[0].messaging;
	for (i = 0; i < events.length; i++) {
		var event = events[i];
		if (event.message && event.message.text) {
            greeting = brain.think(event.message.text);
            sendMessage(event.sender.id, greeting);
		}
	}
	res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: process.env.PAGE_ACCESS_TOKEN
		},
		method: 'POST',
		json: {
			recipient: {
				id: recipientId
			},
			message: {
				text: message
			},
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending message: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
}
