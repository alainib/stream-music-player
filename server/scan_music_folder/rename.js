const path = require("path");
const {extractInfoFromPath, recScanDir} = require('../tools/index.js');

const musicSrcPath = path.join("/Volumes/Multimedia/music");



async function scanFullDirectory(srcPath) {
  await recScanDir(srcPath, callbackFct);
  console.log("scan finished");
}

scanFullDirectory(musicSrcPath);


// rename Folder.jpg to folder.jpg
function callbackFct({filename, path, dir}) {
  console.log({filename, path, dir})
  if (filename !== "folder.jpg" && filename.toLowerCase().includes("folder") && filename.toLowerCase().includes(".jpg")) {
    try {
      console.log('.');
      console.log({
        from: path,
        to: extractInfoFromPath(path)?.pathToParentFolder + "/folder.jpg"
      })
      //  fse.rename(path, extractInfoFromPath(path)?.pathToParentFolder + "/folder.jpg");
    } catch (error) {
      console.error(error.message);
    }
  }
}
