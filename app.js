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
		console.log("Validating webhook...");
		res.status(200).send(req.query['hub.challenge']);
		console.log("Webhook validated");
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
});

app.post('/webhook', function(req, res) {
	var events = req.body.entry[0].messaging;
	for (i = 0; i < events.length; i++) {
		var event = events[i];
		if (event.message && event.message.text && !event.message.is_echo) {
			retrieveUserInfo(event.sender.id, function(err, profile) {
				if (err) throw err;
				response = brain.think(event.message.text, profile);
				sendMessage(event.sender.id, response);
			});
		}
	}
	res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, messageText) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: messageText,
		}
	};
	callSendAPI(messageData);
}

function sendSticker(recipientId) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "image",
				payload: {
					"url": "https://scontent.xx.fbcdn.net/t39.1997-6/p100x100/11405203_1457726111188768_768486346_n.png?_nc_ad=z-m"
				}
			}
		}
	};
	callSendAPI(messageData);
}

function callSendAPI(messageData) {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: process.env.PAGE_ACCESS_TOKEN
		},
		method: 'POST',
		json: messageData
	}, function(error, response, body) {
		if (error) {
			return console.log('Error sending message: ', error);
		} else if (response.body.error) {
			return console.log('Error: ', response.body.error);
		}
	});
}

function retrieveUserInfo(userId, callback) {
	if (!callback) callback = Function.prototype;
	request({
		uri: 'https://graph.facebook.com/v2.6/' + userId.toString(),
		qs: {
			access_token: process.env.PAGE_ACCESS_TOKEN
		},
		method: 'GET',
		json: true
	}, function(error, response, body) {
		if (error) {
			return console.log('Error retrieving user info: ', error);
		} else if (response.body.error) {
			return console.log('Error: ', response.body.error);
		}
		callback(null, body);
	});
}
