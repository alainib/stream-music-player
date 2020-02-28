//https://apiko.com/blog/audio-file-streaming-in-js/

const fse = require('fs-extra');
const path = require('path');

const windows = false;

async function scanDir(dir, fileList = []) {
  const files = await fse.readdir(dir);
  for (const file of files) {
    const stat = await fse.stat(path.join(dir, file));
    if (stat.isDirectory())
      fileList = await scanDir(path.join(dir, file), fileList);
    else {
      if (file.includes('.mp3')) {
        fileList.push(path.join(dir, file));
      }
    }
  }
  return fileList;
}

async function checkDir(dir, fileList = []) {
  const files = await fse.readdir(dir);
  for (const file of files) {
    const stat = await fse.stat(path.join(dir, file));
    fileList.push(path.join(dir, file));
  }
  return fileList;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

function extractInfoFromName(fullPath) {
  let tmp = windows ? fullPath.split('\\') : fullPath.split('/');

  let filename = tmp[tmp.length - 1];
  return { filename, fullPath };
}

/**
 * recupère une entreé de fichier avec path,fr,ar  , renome le fichier en FR et le place dans destPath
 
 * @param {string} source 
 * @param {string} dest 
 */
async function copyEntry(src, dest, newName) {
  try {
    await fse.copy(src, path.join(dest, newName));
    console.log(
      'copy of from ---' + src + '--- to --- ' + dest + newName + '---'
    );
  } catch (err) {
    console.error(err);
  }
  return true;
}

const express = require('express');
const app = express();

app.listen(1002, function() {
  console.log('Example app listening on port 1002');
});

let musicSrcPath = windows ? './music/music' : path.join('music', 'music');
let publicDestPath = windows ? './public/' : path.join(__dirname, 'public');

let _allFiles = null;
let _allFilesLength = 0;

checkDir(path.join(__dirname));
checkDir(musicSrcPath);
checkDir(publicDestPath);

async function initScan() {
  console.log('start scan');
  _allFiles = await scanDir(musicSrcPath);
  _allFilesLength = _allFiles.length;
  console.log('scan finished');
}
// middleware qui rajoute le cross origin et log les url
app.use((request, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  next();
});

initScan();

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/api/next', async function(req, res) {
  if (_allFiles == null) {
    await initScan();
  }
  let next = [];
  for (let i = 0; i < 25; i++) {
    try {
      let n = getRandomInt(_allFilesLength);
      let entry = _allFiles[n];

      let fileInfo = extractInfoFromName(entry);

      await copyEntry(entry, publicDestPath, i + '.mp3');
      next.push(fileInfo);
    } catch (error) {}
  }
  console.log(next);
  res.json(next);
});
