var express = require('express');
var router = express.Router();
var db = require('../database');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

var genRandomString = function(length) {
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
      salt:salt,
      passwordHash:value
  };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);

}

// Add a new user.
router.post('/registration', function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let textPassword = req.body.password;

  var salt = genRandomString(16); /** Gives us salt of length 16 */
  var passwordData = sha512(textPassword, salt);

  console.log('UserPassword = ' + textPassword);
  console.log('Passwordhash = ' + passwordData.passwordHash);
  console.log('nSalt = ' + passwordData.salt);
  // let salt = bcrypt.genSaltSync(saltRounds);
  // let hash = bcrypt.hashSync(textPassword, salt);

  // Technique 1 (generate a salt and hash on separate function calls).
  // bcrypt.genSalt(saltRounds, function(err, salt) {
  //     bcrypt.hash(textPassword, salt, function(err, hash) {
  //         // Store hash in your password DB.
  //         res.send({ message: `'${textPassword}' is my text password.\n'${hash}' is hash.\n'${salt}' is salt.` })
  //
  //     });
  // });

  if (!name || !email || !textPassword) {
      return res.status(400).send({ error: true, message: 'Please provide: name (string), email (string) and textPassword (string).' });
  }

  db.query("INSERT INTO users SET name = ?, email = ?, password = ?, salt = ?", [name, email, passwordData.passwordHash, passwordData.salt], function (error, results, fields) {
      if (error) throw error;
      return res.send({  error: false, data: results, message: `'${textPassword}' is my text password.\n'${passwordData.passwordHash}' is hash.\n'${passwordData.salt}' is salt.` })
      });
});




module.exports = router;
