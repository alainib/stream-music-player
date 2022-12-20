const path = require("path");
const fse = require("fs-extra");
const sharp = require('sharp')
const {createId, recScanDir} = require('../tools/index.js');

const config = require('../config.js');

async function scanFullDirectory(srcPath) {
  await recScanDir(srcPath, callbackFct);
  console.log("resize finished");
}

scanFullDirectory(config.musicSrcPath);


// rename Folder.jpg to folder.jpg
async function callbackFct({filename, path, dir}) {
  try {
    if (filename.startsWith("._AlbumArt")) {
      fse.unlink(path);
    } else if (filename.toLowerCase() === "folder.jpg") {

      console.log(path.replace(".jpg", "_400.jpg"))
      await sharp(path)
        .jpeg({quality: 70})
        .resize({fit: sharp.fit.contain, width: 400})
        .toFile(path.replace(".jpg", "_400.jpg"));

      await sharp(path)
        .jpeg({quality: 60})
        .resize({fit: sharp.fit.contain, width: 100})
        .toFile(path.replace(".jpg", "_50.jpg"));

    }
  } catch (error) {
    console.log("error from " + path);
    console.error(error.message);
  }
  return true;

}
