var express = require('express');
var router = express.Router();
var db = require('../database');

/* GET users listing. */
// router.get('/users', function(req, res, next) {
//   db.query('SELECT * FROM users', function (error, results, fields) {
//       if (error) throw error;
//       return res.send({ error: false, data: results, message: 'List of all users.' });
//   });
//   res.send('Neki respond.');
// });

router.get('/users', function (req, res) {
    db.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'List of all users.' });
    });
});

module.exports = router;
