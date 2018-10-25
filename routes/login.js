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
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

// function verifyPassword(password, combined, callback) {
//   // extract the salt and hash from the combined buffer
//   var saltBytes = combined.readUInt32BE(0);
//   var hashBytes = combined.length - saltBytes - 8;
//   var iterations = combined.readUInt32BE(4);
//   var salt = combined.slice(8, saltBytes + 8);
//   var hash = combined.toString('binary', saltBytes + 8);
//
//   // verify the salt and hash against the password
//   crypto.pbkdf2(password, salt, iterations, hashBytes, function(err, verify) {
//     if (err) {
//       return callback(err, false);
//     }
//     callback(null, verify.toString('binary') === hash);
//   });
// }
//
// function comparePasswords(input, salted, match): {
//   crypto.pbkdf2(input, salted, 10000, LENGTH, diggest, (err: Error, hash: Buffer) => {
//     if (err) {
//       reject(err);
//     } else {
//       setTimeout(() => { resolve((hash.toString("hex") === match) as boolean); }, timeout);
//     }
//   });
// }

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

      console.log('------------------------------------------------------------')
      console.log('passHashed iz baze:             ', passHashed);
      console.log('password iz requesta hashan:    ', loginInput.passwordHash)
      console.log('salt iz requesta', loginInput.salt)
      console.log('------------------------------------------------------------')

      // loginInput.passwordHash i passHashed

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
      //
      // crypto.pbkdf2(loginInput.passwordHash, loginInput.salt, 100000, 64, 'sha512', (err, derivedKey) => {
      //   if (err) throw err;
      //   console.log('derivedKey: ', derivedKey.toString('hex'))
      //
      //   // if (derivedKey)  {
      //   //   var token = jwt.sign(results[0]['password'], results[0]['salt']);
      //   //   return res.send({ error: false, data: token, message: 'Token recieved' });
      //   //   console.log('token: ', token)
      //   // } else {
      //   //   return res.send({error: true, message: 'Hash is incorrect.'});
      //   // }
      //
      //   // if (err) {
      //   //   reject(err);
      //   // } else {
      //   //   setTimeout(() => { resolve((derivedKey.toString("hex") === match) as boolean); }, timeout);
      //   // }
      //   // if (derivedKey.toString('hex') === loginInput.passwordHash) {
      //   //   console.log('USPJESAN LOGIN')
      //   // }
      // });

      // comparePasswords(textPassword, loginInput.salt, loginInput.passwordHash)
      //   .then(async (data: boolean) => {
      //     if (!data) {
      //       return reject(messages.error_user_password_current_incorrect);
      //     }
      //     const token: string = await getAuth0JWT({email, password});
      //
      //
      //
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
