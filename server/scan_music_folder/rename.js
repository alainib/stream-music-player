const path = require("path");
const {extractInfoFromName, recScanDir} = require('../tools/index.js');

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
        to: extractInfoFromName(path)?.pathToParentFolder + "/folder.jpg"
      })
      //  fse.rename(path, extractInfoFromName(path)?.pathToParentFolder + "/folder.jpg");
    } catch (error) {
      console.error(error.message);
    }
  }
}
