
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
const authorised_users = require('./authorised_users.js');
const config = require('./config.js');
const {generateAccessToken} = require('./tools/index.js');

router.get('/api/user/signin', async function (req, res) {
  console.log("get api/user/signin ",);
  return res.json({test: "get api signin ok"});
});


router.post('/api/user/signin', async function (req, res) {
  console.log("post /api/user/signin", req.body);

  try {
    const login = req.body.login;
    const password = encryptpass(req.body.password);
    console.log({login, password})

    if (authorised_users[login] === password) {
      console.log("login ok")
      const accessToken = generateAccessToken({login, password});
      return res.status(200).json({accessToken})
    } else {
      console.log("login not ok", {
        login,
        password_received: req.body.password,
        password_encryptpass: password,
        inBase: authorised_users[login]
      })
    }
  } catch (error) {
    console.error(error)
  }


  return res.status(401).send("Invalid credentials");

});



function encryptpass(word) {
  return sha1(word + config.jwtTokenSecret);
}

module.exports = router;