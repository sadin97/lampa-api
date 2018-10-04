var express = require('express');
var router = express.Router();
var db = require('../database');

const bcrypt = require('bcryptjs');

const saltRounds = 10;

router.post('/login', async function (req, res) {
  let email = req.body.email;
  let textPassword = req.body.password;

  if (!email || !textPassword) {
      return res.status(400).send({ error: true, message: 'Please provide: email (string) and textPassword (string).' });
  }

db.query('SELECT salt, password FROM users where email = ?', email, function (error, results, fields) {
      if (error) throw error;

      console.log("rezultat", results[0]['salt']);
      return results[0];
      // return res.send({ error: false, data: results[0], message: 'User data from provider mail retrieved.' });
  });

  // let hash = ;

  // bcrypt.compare('somePassword', hash, function(err, res) {
  //   if(res) {
  //    // Passwords match
  //   } else {
  //    // Passwords don't match
  //   }
  // });


});

// db.query("INSERT INTO users SET name = ?, email = ?, password = ?, salt = ?", [name, email, hash, salt], function (error, results, fields) {
//     if (error) throw error;
//     return res.send({  error: false, data: results, message: `'${textPassword}' is my text password.\n'${hash}' is hash.\n'${salt}' is salt.` })
//     });

module.exports = router;
