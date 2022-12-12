//https://apiko.com/blog/audio-file-streaming-in-js/

var config = require('./config.js');
const http = require('http');
const path = require("path");
const bodyParser = require('body-parser');

var express = require('express');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.set('port', config.apiPort);


app.use(function (req, res, next) {
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



/**
 * serve static files like mp3 and jpg 
 * http://localhost:3001/static3/pop/Dua%20Lipa/genesis.mp3 * 
 */
const _stat = config.useStaticDatas ? path.join(__dirname,  config.localSrcPath) : config.musicSrcPath;
console.log("static path is " + _stat)
app.use("/static", express.static(_stat));

var api = require('./api');
app.use('/', api);

module.exports = app;