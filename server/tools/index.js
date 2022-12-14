const fse = require("fs-extra");
const path = require("path");
const config = require('../config.js');

/*
usage 

const {extractInfoFromName} = require('./tools/index.js');
extractInfoFromName(fullpath)
*/

// extract filename, fullpath and pathToParentFolder from a complete path
exports.extractInfoFromName = (fullpath) => {

  let tmp, filename, pathToParentFolder;
  if (!!fullpath) {
    tmp = fullpath.split("/");
    filename = tmp[tmp.length - 1];
    pathToParentFolder = fullpath.substring(0, fullpath.lastIndexOf('/'));
  }
  return {filename, fullpath, pathToParentFolder};
}

exports.createId = (path) => {
  return path.replace(config.musicSrcPath, "")
    .replaceAll(" ", "_")
    .replaceAll("/", "_")
}

exports.recScanDir = recScanDir;

async function recScanDir(dir, callbackFct, fileList = []) {
  console.log('recScanDir ' + dir)
  const files = await fse.readdir(dir);

  for (const filename of files) {
    if (filename.toLowerCase().includes("/cache/")) {

    } else {
      let _path = path.join(dir, filename);
      const stat = await fse.stat(_path);
      if (stat.isDirectory())
        await recScanDir(_path, callbackFct, fileList);
      else {
        await callbackFct({path: _path, dir, filename});
      }
    }
  }
  return true;
}




