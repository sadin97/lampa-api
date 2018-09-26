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





// default route
// app.get('/', function (req, res) {
//     return res.send({ error: true, message: 'hello' })
// });

// Retrieve all measurements.
router.get('/measurements', function (req, res) {
    db.query('SELECT * FROM measurements', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'List of all measurements.' });
    });
});

// Retrieve measurement with id.
router.get('/measurement/:id', function (req, res) {
    let measurement_id = req.params.id;
    if (!measurement_id) {
        return res.status(400).send({ error: true, message: 'Please provide measurement id.' });
    }
    db.query('SELECT * FROM measurements where id=?', measurement_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Measurement id list.' });
    });

});

//  Delete measurement.
router.delete('/measurement/:id', function (req, res) {
    let measurement_id = req.params.id;
    db.query('DELETE FROM measurements WHERE id = ?', [measurement_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Measurement has been deleted successfully.' });
    });
});

// Add a new measurement.
router.post('/measurement', function (req, res) {

  let aqi = req.body.aqi;
  let pm25 = req.body.pm25;
  let pm10 = req.body.pm25;
  let co2 = req.body.co2;
  let date = req.body.date;
  let time = req.body.time;
  let deviceId = req.body.deviceId;

  if (!aqi || !pm25 || !pm10 || !co2 || !date || !time || !deviceId) {
      return res.status(400).send({ error: true, message: 'Please provide: aqi (int), pm25 (int), pm10 (int), co2 (int), date (string), time (string) and deviceId (int).' });
  }

    db.query("INSERT INTO measurements SET aqi = ?, pm25 = ?, pm10 = ?, co2 = ?, date = ?, time = ?", [aqi, pm25, pm10, co2, date, time], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New measurement has been created successfully.' });
    });
});

// Update measurement with id.
router.put('/measurement', function (req, res) {

    let measurement_id = req.body.measurement_id;
    // let measure = req.body.measure;
    let aqi = req.body.aqi;
    let pm25 = req.body.pm25;
    let pm10 = req.body.pm25;
    let co2 = req.body.co2;
    let date = req.body.date;
    let time = req.body.time;

    if (!measurement_id || !aqi || !pm25 || !pm10 || !co2 || !date || !time) {
        return res.status(400).send({ error: true, message: 'Please provide: measurement_id (int), aqi (int), pm25 (int), pm10 (int), co2 (int), date (string) and time (string).' });
    }

    db.query("UPDATE measurements SET aqi = ?, pm25 = ?, pm10 = ?, co2 = ?, date = ?, time = ? WHERE id = ?", [aqi, pm25, pm10, co2, date, time, measurement_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Measurement has been updated successfully.' });
    });
});














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
