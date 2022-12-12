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