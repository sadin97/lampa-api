var express = require('express');
var router = express.Router();
var db = require('../database');
var uuid = require('uuid');
const crypto = require('crypto');
var bcrypt = require('bcryptjs');
const saltRounds = 10;

var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
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

  // console.log(uuid.v1());
  // console.log(uuid.v3());
  // console.log(uuid.v4());

  db.query('SELECT salt, password, name FROM users where email = ?', email, function (error, results, fields) {
      if (error) throw error;
      let salt = results[0]['salt'];
      let passHashed = results[0]['password'];

      console.log('name: ', results[0]['name'])

      let loginInput = sha512(textPassword, salt);

      console.log('passHashed iz baze: ', passHashed);
      console.log('password iz requesta hashan', loginInput.passwordHash)
      console.log('salt iz requesta', loginInput.salt)

      crypto.pbkdf2(loginInput.passwordHash, loginInput.salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) throw err;
        console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
      });

      // comparePasswords(textPassword, loginInput.salt, loginInput.passwordHash)
      //   .then(async (data: boolean) => {
      //     if (!data) {
      //       return reject(messages.error_user_password_current_incorrect);
      //     }
      //     const token: string = await getAuth0JWT({email, password});
      //     return resolve(token);
      //   })
      //   .catch((error: Error) => {
      //     return reject(messages.error_user_password_current_incorrect);
      //   });
      //
      //   export function comparePasswords(input: string, salted: string, match: string): Promise<boolean> {
      //     return new Promise<boolean>((resolve: (data) => void, reject: (data) => void) => {
      //       crypto.pbkdf2(input, salted, 10000, LENGTH, diggest, (err: Error, hash: Buffer) => {
      //         if (err) {
      //           reject(err);
      //         } else {
      //           setTimeout(() => { resolve((hash.toString("hex") === match) as boolean); }, timeout);
      //         }
      //       });
      //     });
      //   }

      console.log('User data from provider mail retrieved.');
      return res.send({ error: false, data: results, message: 'Request ended.' });
  });

});



module.exports = router;
