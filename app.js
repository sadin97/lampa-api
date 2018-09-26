var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('./database');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var users = require('./routes/users');
var devices = require('./routes/devices');
var measurements = require('./routes/measurements');
var userdevice = require('./routes/userdevice');

app.use('/api/v1/', users);
app.use('/api/v1/', devices);
app.use('/api/v1/', measurements);
app.use('/api/v1/', userdevice);

// Default route.
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api/v1', router);

// All other requests redirect to 404.
app.all("*", function (req, res, next) {
    return res.send('Page not found (use some other).');
    next();
});

// Port must be set to 8080 because incoming http requests are routed from port 80 to port 8080.
app.listen(8080, function () {
    console.log('Node app is running on port 8080.');
});

// Allows "grunt dev" to create a development server with livereload.
module.exports = app;
