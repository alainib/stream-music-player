
const fse = require("fs-extra");
const path = require("path");
const music_metadata = require('music-metadata');
const config = require('../config.js');
const {createId} = require('../tools/index.js');

const outputJSON = "output.ndjson";

let index = 0;

function lower(s) {
  if (!!s) {
    return s.toLowerCase().replace("  ", " ");
  }
  return null;
}

async function recScanDir(dir, fileList = []) {
  const files = await fse.readdir(dir);

  for (const filename of files) {
    const _path = path.join(dir, filename);
    const stat = await fse.stat(_path);
    if (filename.toLowerCase().includes("/cache/")) {

    } else if (stat.isDirectory())
      fileList = await recScanDir(_path, fileList);
    else {
      if (!filename.startsWith(".") && filename.includes(".mp3")) {
        console.log(index++);
        try {
          const metadata = await music_metadata.parseFile(_path);
          const {title, genre, artist, album, year, rating} = metadata?.common;
          const line = {
            title: lower(title), genre: lower(genre?.[0]), artist: lower(artist), album: lower(album),
            year, path: _path.replace(config.musicSrcPath, ""),
            rating: cleanRating(rating),
            id: createId(_path)
          };
          fileList.push(line);
          await fse.appendFile(outputJSON, JSON.stringify(line) + "\n");
        } catch (error) {
          console.error(error.message);
        }
      } else if (filename.endsWith("_50.jpg") || filename.endsWith("_400.jpg")) {
        // fse.unlink(_path);
      }
    }
  }
  return fileList;
}

function cleanRating(rating) {
  /**
   * some rating are equals to [{"source":"Windows Media Player 9 Series","rating":0.5}]
   * so to 0.23234234 
   * some null
   */
  let r = 0;
  try {
    if (!!rating) {
      if (Array.isArray(rating)) {
        r = rating?.[0]?.rating
      } else {
        r = rating
      }
    }
  } catch (error) {
    console.log("cannot cleanRating of", rating);
  }

  return Math.round(r * 5)

}

/**
 * this script scan the config.musicSrcPath path and write all music info into output.ndjson file ( title album artist genre path)
 */
async function scanFullDirectory(srcPath) {
  await recScanDir(srcPath);
  console.log("scan finished");
}

scanFullDirectory(config.musicSrcPath);
