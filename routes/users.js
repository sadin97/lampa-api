var express = require('express');
var router = express.Router();
var db = require('../database');

// Retrieve all users.
router.get('/users', function (req, res) {
    db.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'List of all users.' });
    });
});

// Retrieve user with id.
router.get('/user/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id.' });
    }
    db.query('SELECT * FROM users where id = ?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'User id list.' });
    });
});

// Update user with id.
router.put('/user/:id', function (req, res) {
    let user_id = req.params.id;
    let name = req.body.name;



    res.send(JSON.stringify(req.body));


    // if (!user_id) {
    //     return res.status(400).send({ error: true, message: 'Please provide user id.' });
    // }
    // db.query('UPDATE users SET name = ? WHERE id = ?', [name, user_id], function (error, results, fields) {
    //     if (error) throw error;
    //     return res.send({ error: false, data: results[0], message: 'Successfully updated.' });
    // });
});

module.exports = router;
