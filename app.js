var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('The server is OK.');
});

app.get('/webhook', function(req, res) {
    if (req.query(['hub.verify_token'] === 'miranda_verify')) {
        res.send(req.query['hub.challenge']);
        console.log(req.query);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.listen(process.env.PORT || 5000);
