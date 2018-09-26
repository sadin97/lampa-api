var express = require('express');
var router = express.Router();
var db = require('../database');

router.get('/users', function (req, res) {
    db.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'List of all users.' });
    });
});

// Update device with id.
router.put('/user', function (req, res) {
    let user_id = req.body.user_id;
    let name = req.body.name;
    if (!user_id || !name) {
        return res.status(400).send({ error: true, message: 'Please provide: user_id (int) and name (string).' });
    }
    db.query("UPDATE users SET name = ? WHERE id = ?", [name, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
});

module.exports = router;
