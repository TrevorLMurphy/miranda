var express = require('express');
var app = express();

app.get('/hello', function (req, res) {
    res.send('world!');
});

app.get('/webhook', function (req, res) {
    if (req.query(['hub.verify_token'] === 'secret-token')) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.listen(process.env.PORT || 5000);
