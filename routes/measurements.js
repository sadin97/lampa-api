var express = require('express');
var router = express.Router();
var db = require('../database');

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

// Delete measurement.
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
    db.query("INSERT INTO measurements SET aqi = ?, pm25 = ?, pm10 = ?, co2 = ?, date = ?, time = ?, deviceId = ?", [aqi, pm25, pm10, co2, date, time, deviceId], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New measurement has been created successfully.' });
    });
});

// Update measurement with id.
router.put('/measurement/:id', function (req, res) {
    let measurement_id = req.params.id;
    let aqi = req.body.aqi;
    let pm25 = req.body.pm25;
    let pm10 = req.body.pm25;
    let co2 = req.body.co2;
    let date = req.body.date;
    let time = req.body.time;
    if (!aqi || !pm25 || !pm10 || !co2 || !date || !time) {
        return res.status(400).send({ error: true, message: 'Please provide: measurement_id (int), aqi (int), pm25 (int), pm10 (int), co2 (int), date (string) and time (string).' });
    }
    db.query("UPDATE measurements SET aqi = ?, pm25 = ?, pm10 = ?, co2 = ?, date = ?, time = ? WHERE id = ?", [aqi, pm25, pm10, co2, date, time, measurement_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Measurement has been updated successfully.' });
    });
});

module.exports = router;
