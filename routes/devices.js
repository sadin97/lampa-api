var express = require('express');
var router = express.Router();
var db = require('../database');




// Retrieve all devices.
router.get('/devices', function (req, res) {
    db.query('SELECT * FROM devices', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'List of all devices.' });
    });
});

// Retrieve device with id.
router.get('/device/:id', function (req, res, next) {

    let device_id = req.params.id;
    if (!device_id) {
      return res.status(400).send({ error: true, message: 'Please provide device id.' });
    }
    db.query('SELECT * FROM devices where id = ?', device_id, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results[0], message: 'Device id list.' });
    });
});

// Update device with id.
// router.put('/device/:id', function (req, res) {
//     let device_id = req.params.id;
//     let name = req.body.name + '';
//     if (!device_id) {
//         return res.status(400).send({ error: true, message: 'Please provide device id.' });
//     }
//     db.query('UPDATE devices SET name = ? WHERE id = ?', [name, device_id], function (error, results, fields) {
//         if (error) throw error;
//         return res.send({ error: false, data: results[0], message: 'Device successfully updated.' });
//     });
// });

// Update device with id.
router.put('/device', function (req, res) {
    let device_id = req.body.device_id;
    let name = req.body.name;
    if (!device_id || !name) {
        return res.status(400).send({ error: true, message: 'Please provide: device_id (int) and name (string).' });
    }
    db.query("UPDATE devices SET name = ? WHERE id = ?", [name, device_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Device has been updated successfully.' });
    });
});

module.exports = router;
