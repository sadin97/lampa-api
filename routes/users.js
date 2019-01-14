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

  // res.setHeader('Content-Type', 'application/json');
  if (!user_id) {
     return res.status(400).send({ error: true, message: 'Please provide user id.' });
  }

  if (/^[a-zA-Z]+$/.test(name)) { // If user name is only letters.
    // res.send({ message: 'You sent valid name!', new_name: `${name}`, user_id: `${user_id}` });
    db.query('UPDATE users SET name = ? WHERE id = ?', [name, user_id], function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results[0], message: 'Successfully updated.' });
    });
  } else {
    res.send({ message: `'${name}' is not valid string.` })
  }
});

module.exports = router;
