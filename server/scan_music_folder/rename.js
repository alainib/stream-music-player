
const fse = require("fs-extra");
const path = require("path");
const {extractInfoFromName} = require('./tools/index.js');

const musicSrcPath = path.join("/Volumes/Multimedia/music");

async function recScanDir(dir, fileList = []) {
  const files = await fse.readdir(dir);

  for (const filename of files) {
    let _path = path.join(dir, filename);
    const stat = await fse.stat(_path);
    if (stat.isDirectory())
      await recScanDir(_path, fileList);
    else {
      if (filename !== "folder.jpg" && filename.toLowerCase().includes("folder") && filename.toLowerCase().includes(".jpg")) {
        try {
          console.log('.');
          fse.rename(_path, extractInfoFromName(_path)?.pathToParentFolder + "/folder.jpg");
        } catch (error) {
          console.error(error.message);
        }
      }
    }
  }
}


async function scanFullDirectory(srcPath) {
  await recScanDir(srcPath);
  console.log("scan finished");
}

scanFullDirectory(musicSrcPath);




/*
async function checkDir(dir) {
  const fileList = [];
  const files = await fse.readdir(dir);
  for (const filename of files) {
    fileList.push(path.join(dir, filename));
  }   
  return fileList;
}

checkDir(musicSrcPath);
*/