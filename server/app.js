//https://apiko.com/blog/audio-file-streaming-in-js/

var config = require('./config.js');
const http = require('http');

const path = require('path');
var serveStatic = require('serve-static');
const bodyParser = require('body-parser');

var express = require('express');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.set('port', config.apiPort);


app.use(function (req, res, next) {
  console.log("use access")
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*"); //config.frontIp
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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


var api = require('./api');
app.use('/', api);




/*

const fse = require("fs-extra");
const path = require("path");
let bodyParser = require("body-parser");

const express = require("express");
const app = express();
const cors = require("cors");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies

app.use(cors());
app.options("*", cors());

// middleware qui rajoute le cross origin
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.use(express.static(path.join("..", __dirname, "client", "build")));

const musicSrcPath = path.join("/Volumes/Multimedia/music");

app.use("/static", express.static(musicSrcPath));
// app.use("/static", express.static(path.join(__dirname, "public")));

app.get('/api/test', function (req, res) {
  console.log("test " + req.body);
  res.status(200).send({test: "ok"});
});

var api = require('./api');
app.use('/', api);

app.listen(1002, function () {
  console.log("Example app listening on port 1002");
});
*/

module.exports = app;