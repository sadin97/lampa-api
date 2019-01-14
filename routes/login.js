var express = require('express');
var router = express.Router();
var db = require('../database');
var uuid = require('uuid');
const crypto = require('crypto');
var bcrypt = require('bcryptjs');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
var jwtDecode = require('jwt-decode');

var sha512 = function(password, salt) {
  var hash = crypto.createHmac('sha512', salt); /* Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

router.post('/login', async function (req, res) {
  let email = req.body.email;
  let textPassword = req.body.password;
  if (!email || !textPassword) {
    return res.status(400).send({ error: true, message: 'Please provide: email (string) and textPassword (string).' });
  }
  db.query('SELECT salt, password, name FROM users where email = ?', email, function (error, results, fields) {
    if (error) throw error;
    let salt = results[0]['salt'];
    let passHashed = results[0]['password'];
    let loginInput = sha512(textPassword, salt);
    
    // console.log('name: ', results[0]['name'])
    // console.log('------------------------------------------------------------')
    // console.log('passHashed iz baze:             ', passHashed);
    // console.log('password iz requesta hashan:    ', loginInput.passwordHash)
    // console.log('salt iz requesta', loginInput.salt)
    // console.log('------------------------------------------------------------')

    let object = {
      email: email,
      name: results[0]['name']
    }

    if (passHashed === loginInput.passwordHash) {
      var token = jwt.sign(object, 'shhhhh');
      console.log('poslao token: ', token);
      req.headers.authorization = token;
      return res.send({ error: false, data: token, message: 'Token recieved.' });
    } else {
      return res.send({ error: true, message: 'Invalid password.' });
    }
    return res.send({ error: false, data: results, message: 'User data from provider mail retrieved.' });
  });
});

module.exports = router;
