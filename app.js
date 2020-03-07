//https://apiko.com/blog/audio-file-streaming-in-js/

const fse = require("fs-extra");
const path = require("path");
let bodyParser = require("body-parser");

for (let i = 0; i < 100; i++) {
  console.log(" ");
}

async function scanDir(dir, fileList = []) {
  const files = await fse.readdir(dir);
  for (const file of files) {
    const stat = await fse.stat(path.join(dir, file));
    if (stat.isDirectory())
      fileList = await scanDir(path.join(dir, file), fileList);
    else {
      if (file.includes(".mp3")) {
        fileList.push(path.join(dir, file).replace(musicSrcPath, ""));
      }
    }
  }

  return fileList;
}

async function checkDir(dir, dirname) {
  const fileList = [];
  const files = await fse.readdir(dir);
  for (const file of files) {
    fileList.push(path.join(dir, file));
  }
  console.log(dirname, fileList);
  return fileList;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

function extractInfoFromName(fullpath) {
  let tmp = inWindows ? fullpath.split("\\") : fullpath.split("/");
  let filename = tmp[tmp.length - 1];
  return { filename, fullpath };
}

const inWindows = false;

if (inWindows) {
  console.log("warning path is set for windows");
}

let musicSrcPath = inWindows
  ? "/\\NAS/Multimedia/music"
  : path.join("music", "music");

let _allFiles = null;
let _allFilesLength = 0;
// arborescence avec genre / artist / album
let threeCatalogue = {};

// checkDir('/' , "dirname");
checkDir(musicSrcPath, "musicSrcPath");

async function initScan() {
  _allFiles = await scanDir(musicSrcPath);
  _allFilesLength = _allFiles.length;
  console.log("scan finished");
}

initScan();

const express = require("express");
const app = express();
const cors = require("cors");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use(cors());
app.options("*", cors());

// middleware qui rajoute le cross origin et log les url
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/static", express.static(musicSrcPath));
// app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/api/next", async function(req, res) {
  if (_allFiles == null) {
    await initScan();
  }
  let next = [];
  for (let i = 0; i < 10; i++) {
    try {
      let n = getRandomInt(_allFilesLength);
      let entry = _allFiles[n];

      let fileInfo = extractInfoFromName(entry);
      next.push(fileInfo);
    } catch (error) {
      console.log(error);
    }
  }

  res.json(next);
});

app.post("/api/erasemusic", async function(req, res) {
  console.log("erasemusic", req.body);

  let { fullpath } = req.body;

  fse.unlinkSync(fullpath);

  res.status(200);
});

app.listen(1002, function() {
  console.log("Example app listening on port 1002");
});
