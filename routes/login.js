var express = require('express');
var router = express.Router();
var db = require('../database');
var uuid = require('uuid');
var bcrypt = require('bcryptjs');
const saltRounds = 10;

router.post('/login', async function (req, res) {
  let email = req.body.email;
  let textPassword = req.body.password;

  if (!email || !textPassword) {
    return res.status(400).send({ error: true, message: 'Please provide: email (string) and textPassword (string).' });
  }
  // console.log(uuid.v1());
  // console.log(uuid.v3());
  // console.log(uuid.v4());
  db.query('SELECT salt, password, name FROM users where email = ?', email, function (error, results, fields) {
      if (error) throw error;
      let salt = results[0]['salt'];
      let passHashed = results[0]['password'];

      console.log('name: ', results[0]['name'])

      let loginInput = bcrypt.hashSync(textPassword, salt);

      console.log('passHashed iz baze: ', passHashed);
      console.log('password iz requesta hashan i saltiran ', loginInput)

      // if (loginInput === passHashed) {
      //   console.log('Password matches!');
      // } else {
      //   console.log('Password don\'t match!');
      // }

      bcrypt.compare(textPassword, passHashed, function(err, res) {
        console.log("err", err);
        console.log("res", res);
        if (res) {
         console.log('Password matches!');
        } else {
         console.log('Password don\'t match!');
        }
      });

      console.log('User data from provider mail retrieved.');
      return res.send({ error: false, data: results, message: 'Request ended.' });
  });

  // if (salt === '') {
  //   return res.send({  message: 'Salt is empty, error!' })
  // }

});

// db.query("INSERT INTO users SET name = ?, email = ?, password = ?, salt = ?", [name, email, hash, salt], function (error, results, fields) {
//     if (error) throw error;
//     return res.send({  error: false, data: results, message: `'${textPassword}' is my text password.\n'${hash}' is hash.\n'${salt}' is salt.` })
//     });

module.exports = router;
