
const fse = require("fs-extra");
const path = require("path");
const music_metadata = require('music-metadata');

const musicSrcPath = path.join("/Volumes/Multimedia/music");
const outputJSON = "output.json";

async function recScanDir(dir, fileList = []) {
  const files = await fse.readdir(dir);

  for (const filename of files) {
    const _path = path.join(dir, filename);
    const stat = await fse.stat(_path);
    if (stat.isDirectory())
      fileList = await recScanDir(_path, fileList);
    else {
      if (!filename.startsWith(".") && filename.includes(".mp3")) {
        console.log(".")
        try {
          const metadata = await music_metadata.parseFile(_path);
          const {title, genre, artist, album, year} = metadata?.common;
          const line = {title, genre, artist, album, year, path: _path.replace(musicSrcPath, ""), id: _path.replace(musicSrcPath, "")};
          fileList.push(line);
          await fse.appendFile(outputJSON, JSON.stringify(line) + "\n");
        } catch (error) {
          console.error(error.message);
        }
      }
    }
  }
  return fileList;
}


async function scanFullDirectory(srcPath) {
  let _allFiles = await recScanDir(srcPath);
  console.log("scan finished");
  console.log(JSON.stringify(_allFiles));
}

scanFullDirectory(musicSrcPath);
