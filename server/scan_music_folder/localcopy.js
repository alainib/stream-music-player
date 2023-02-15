var config = require('../config.js');
const fse = require("fs-extra");
const path = require("path");

/**
 * copy files from staticDatas to public_music to be used without NAS storage 
 * for test
 */
async function runcopy() {
  for (const element of config.staticDatas) {

    let originalPath = element.path;
    let destPath = path.join("../public_music/", element.path);
    console.log(originalPath, destPath);

    fse.copy(originalPath, destPath);
  }
}

runcopy();

