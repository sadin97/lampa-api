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

app.use('/api/v1/', users);
app.use('/api/v1/', devices);
app.use('/api/v1/', measurements);

// Default route.
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api/v1', router);

// Add a new user-device connection.
router.post('/userdevice', function (req, res) {

  let userID = req.body.userID;
  let deviceID = req.body.deviceID;

  if (!userID || !deviceID) {
      return res.status(400).send({ error: true, message: 'Please provide: userId (int) and deviceId (int).' });
  }

    db.query("INSERT INTO userdevices SET userID = ?, deviceID = ?", [userID, deviceID], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user-device connection has been created successfully.' });
    });
});

// Retrieve user from user-devices with id.
router.get('/userdevice/:userID', function (req, res) {
    let user_id = req.params.userID;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id.' });
    }
    db.query('SELECT * FROM userdevices where userID = ?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Successfully retrieved user-device data.' });
    });

});

// all other requests redirect to 404
router.all("*", function (req, res, next) {
    return res.send('Page not found (use some other).');
    next();
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080.');
});

// allows "grunt dev" to create a development server with livereload
module.exports = app;
