//https://apiko.com/blog/audio-file-streaming-in-js/

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

// middleware qui rajoute le cross origin et log les url
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(path.join("..", __dirname, "client", "build")));

const musicSrcPath = path.join("/Volumes/Multimedia/music");

app.use("/static", express.static(musicSrcPath));
// app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/api/next", async function (req, res) {
  /*
  function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  function extractInfoFromName(fullpath) {
    let tmp = fullpath.split("/");
    let filename = tmp[tmp.length - 1];
    return {filename, fullpath};
  }
  let _allFiles = null;
  let _allFilesLength = 0;

  if (_allFiles == null) {
    await initScan();
  }
  let next = [];
  for (let i = 0; i < 50; i++) {
    try {
      let n = getRandomInt(_allFilesLength);
      let entry = _allFiles[n];
      if (entry) {
        let fileInfo = extractInfoFromName(entry);
        next.push(fileInfo);
      } else {
        console.log(entry);
      }

    } catch (error) {
      console.log(error);
    }
  }

  res.json(next);
  */
});

app.post("/api/erasemusic", async function (req, res) {
  console.log("erasemusic", req.body);

  let {fullpath} = req.body;

  const pos = fullpath.indexOf("/static") + "/static".length;

  let path = musicSrcPath + fullpath.slice(pos);

  fse.unlinkSync(path);
  res.status(200);
});

app.listen(1002, function () {
  console.log("Example app listening on port 1002");
});
