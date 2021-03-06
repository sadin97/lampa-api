var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('./database');
var jwtDecode = require('jwt-decode');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var users = require('./routes/users');
var devices = require('./routes/devices');
var measurements = require('./routes/measurements');
var userdevice = require('./routes/userdevice');
var login = require('./routes/login');
var registration = require('./routes/registration');

function middleware (req, res, next) {
  // console.log("Middleware is called!");
  let token = req.headers.authorization
  if (!token) {
    return res.send('You did not sent token authorization.');
  } else {
    token = req.headers.authorization.slice(7); // Ovo je headers.

    // First security checks.
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.");
    }

    let decoded = jwtDecode(token); // Dekodirani token u middleware-u.

    db.query('SELECT * FROM users where Email = ?', decoded.email, function (error, results, fields) {
      if (decoded.email === results[0].Email) {
        res.send('I found email: ', results[0].Email);
      } else {
        res.send('Email: ', decoded.email, ' is not found.');
      }
    });
  }
  next();
}
app.use('/api/v1/', registration);
app.use('/api/v1/', login);
app.use('/api/v1/', middleware, users);
app.use('/api/v1/', middleware, devices);
app.use('/api/v1/', middleware, measurements);
app.use('/api/v1/', middleware, userdevice);

// Default route.
router.get('/', function(req, res) {
  return res.send('hooray! welcome to our api!');
});

app.use('/api/v1', router);

// All other requests redirect to 404.
app.all("*", function (req, res, next) {
  return res.send('Page not found (use some other).');
  next();
});

// Port must be set to 8080 because incoming http requests are routed from port 80 to port 8080.
app.listen(4545, function () {
  console.log('Node app is running on port 4545.');
});

// Allows "grunt dev" to create a development server with livereload.
module.exports = app;

// res.json({ message: 'hooray! welcome to our api!' });
