//https://apiko.com/blog/audio-file-streaming-in-js/

var config = require('./config.js');
const http = require('http');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
var express = require('express');
const {stringStartsWith, stringIsOneOf} = require('./tools/index.js');
const authorised_users = require('./authorised_users.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.set('port', config.apiPort);


app.options('*', cors()) // enable pre-flight request


const adminPaths = ["/api/erasemusic"];

app.use(function (req, res, next) {

  console.log("req.originalUrl  " + req.originalUrl);

  const debug = false;


  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.setHeader("Access-Control-Allow-Origin", "*"); //config.frontIp
  res.setHeader("Access-Control-Allow-Headers", "Origin, x-access-token, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);

  const needAdminPrivilege = stringIsOneOf(req.originalUrl, adminPaths)

  if (stringStartsWith(req.originalUrl, "/api/test/") || stringStartsWith(req.originalUrl, "/api/user/") || stringStartsWith(req.originalUrl, "/static/")) {
    console.log("no check");
    next();
  } else {
    //get the token from the header if present 

    const token = req.headers['x-access-token'];

    debug && console.log("checking token", {token})

    //if no token found, return response (without going to the next middelware)
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    try {
      //if can verify the token, set req.user and pass to next middleware

      jwt.verify(token, config.jwtTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(401)
        }
        debug && console.log(user)
        // check if this route need admin and user is not admin
        if (needAdminPrivilege && !authorised_users[user.login].admin) {
          res.status(401).send("wrong privileges.");
        }

        req.user = user;
        next();
      });

    } catch (ex) {
      console.log("error decoding token", ex);
      //if invalid token
      res.status(400).send("Invalid token.");
    }
  }
})

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(config.apiPort, config.apiIp, () => {
  console.log(`Server running at http://${config.apiIp}:${config.apiPort}/`);
});
server.on('error', onError);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof config.apiPort === 'string'
    ? 'Pipe ' + config.apiPort
    : 'Port ' + config.apiPort

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}



/**
 * serve static files like mp3 and jpg 
 * http://localhost:3001/static3/pop/Dua%20Lipa/genesis.mp3 * 
 */
console.log("static path is " + config.staticFileIp)
app.use("/static", express.static(config.staticFileIp));

var api = require('./api');
app.use('/', api);

var api_user = require('./users');
app.use('/', api_user);

module.exports = app;