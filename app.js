const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lampa'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// connect to database
mc.connect();

// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});

// Retrieve all measurements.
app.get('/measurements', function (req, res) {
    mc.query('SELECT * FROM measurements', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'List of all measurements.' });
    });
});

// Retrieve measurement with id.
app.get('/measurement/:id', function (req, res) {
    let measurement_id = req.params.id;
    if (!measurement_id) {
        return res.status(400).send({ error: true, message: 'Please provide measurement id.' });
    }
    mc.query('SELECT * FROM measurements where id=?', measurement_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Measurement id list.' });
    });

});

//  Delete measurement.
app.delete('/measurement/:id', function (req, res) {
    let measurement_id = req.params.id;
    mc.query('DELETE FROM measurements WHERE id = ?', [measurement_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Measurement has been deleted successfully.' });
    });
});

// Add a new measurement.
app.post('/measurement', function (req, res) {

  let aqi = req.body.aqi;
  let pm25 = req.body.pm25;
  let pm10 = req.body.pm25;
  let co2 = req.body.co2;
  let date = req.body.date;
  let time = req.body.time;

  if (!aqi || !pm25 || !pm10 || !co2 || !date || !time) {
      return res.status(400).send({ error: true, message: 'Please provide: measurement_id (int), aqi (int), pm25 (int), pm10 (int), co2 (int), date (string) and time (string).' });
  }

    mc.query("INSERT INTO measurements SET aqi = ?, pm25 = ?, pm10 = ?, co2 = ?, date = ?, time = ?", [aqi, pm25, pm10, co2, date, time], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New measurement has been created successfully.' });
    });
});

// Update measurement with id.
app.put('/measurement', function (req, res) {

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

    mc.query("UPDATE measurements SET aqi = ?, pm25 = ?, pm10 = ?, co2 = ?, date = ?, time = ? WHERE id = ?", [aqi, pm25, pm10, co2, date, time, measurement_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Measurement has been updated successfully.' });
    });
});

// all other requests redirect to 404
app.all("*", function (req, res, next) {
    return res.send('Page not found (use some other).');
    next();
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080.');
});

// allows "grunt dev" to create a development server with livereload
module.exports = app;
