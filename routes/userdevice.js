var express = require('express');
var router = express.Router();
var db = require('../database');

// Add a new user-device connection.
router.post('/userdevice/:id', function (req, res) {
  let user_id = req.params.id;
  let device_id = req.body.deviceID;
  if (!user_id || !device_id) {
    return res.status(400).send({ error: true, message: 'Please provide: userId (int) and deviceId (int).' });
  }
  db.query("INSERT INTO userdevices SET userID = ?, deviceID = ?", [user_id, device_id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New user-device connection has been created successfully.' });
  });
});

// Retrieve user from user-devices with id.
router.get('/userdevice/user/:id', function (req, res) {
  let user_id = req.params.id;
  if (!user_id) {
    return res.status(400).send({ error: true, message: 'Please provide user id.' });
  }
  db.query('SELECT * FROM userdevices where userID = ?', user_id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Successfully retrieved user from user-device table.' });
  });
});

// Retrieve device from user-devices with id.
router.get('/userdevice/device/:id', function (req, res) {
  let device_id = req.params.id;
  if (!device_id) {
    return res.status(400).send({ error: true, message: 'Please provide device id.' });
  }
  db.query('SELECT * FROM userdevices where deviceID = ?', device_id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Successfully retrieved device from user-device table.' });
  });
});

// Delete user from all devices.
router.delete('/userdevice/user/:id', function (req, res) {
  let user_id = req.params.id;
  db.query('DELETE FROM userdevices WHERE userID = ?', [user_id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'User has been disconnected from every device successfully.' });
  });
});

// Delete user from deviceId.
router.delete('/userdevice/device/:id', function (req, res) {
  let device_id = req.params.id;
  db.query('DELETE FROM userdevices WHERE deviceID = ?', [device_id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Device has been disconnected from every user successfully.' });
  });
});

// Disconnect specific userId from specific deviceId.
router.delete('/userdevice/userdev/:userId/:devId', function (req, res) {
  let user_id = req.params.userId;
  let device_id = req.params.devId;
  db.query('DELETE FROM userdevices WHERE deviceID = ? AND userID = ?', [device_id, user_id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'User is successfully disconnected from specific device.' });
  });
});

module.exports = router;
