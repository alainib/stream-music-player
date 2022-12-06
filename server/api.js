
var express = require('express');
var router = express.Router();
const axios = require('axios');
const config = require('./config.js');

const instance = axios.create({
  baseURL: config.elasticUrl,
  timeout: 15000,
  auth: {
    username: config.elasticUserName,
    password: config.elasticPassword
  },
  headers: {Accept: "application/json", "Content-Type": "application/json"}
});

router.get('/api/test', async function (req, res) {
  console.log("get api/test ",);
  return res.json({test: "get api test ok"});
});


router.post('/api/search', async function (req, res) {
  console.log("post /api/search ", req.body);
  const {search, field} = req.body;

  try {
    const response = await searchMusic({search, field});
    res.status(200).json(response.data.data);
  } catch (err) {
    console.log(err)
    res.status(500).json({message: err});
  }

});





async function searchMusic({search = "", filterOnField = "title.keyword"}) {
  const url = "/listmp3/_search";
  console.log("calling api searchMusic", {search, filterOnField})
  let wildcard = {}
  if (filterOnField) {
    wildcard[filterOnField] = {
      "value": search + "*"
    }
  }
  const response = await instance.post(url, {
    "query": {
      "bool": {
        "must": [{wildcard}]
      }
    },
    "_source": {
      "includes": "*"
    },
    "size": 100,
    "track_total_hits": true,
    "aggs": {
      "titre": {
        "terms": {
          "size": 50,
          "field": "titre.keyword_not_normalized"
        }
      },
      "album": {
        "terms": {
          "size": 50,
          "field": "album.keyword_not_normalized"
        }
      },
      "genre": {
        "terms": {
          "size": 50,
          "field": "genre.keyword_not_normalized"
        }
      },
      "artist": {
        "terms": {
          "size": 50,
          "field": "artist.keyword_not_normalized",
          "order": {
            "_key": "asc"
          }
        }
      }
    }
  });

  return response

}


/*
app.get("/api/search", async function (req, res) {
  console.log("search " + req.body);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  function extractInfoFromName(fullpath) {
    let tmp = fullpath.split("/");
    let filename = tmp[tmp.length - 1];
    return {filename, fullpath};
  }
  let _allFiles = null;
  let _allFilesLength = 0;

  if (_allFiles == null) {
    await initScan();
  }
  let next = [];
  for (let i = 0; i < 50; i++) {
    try {
      let n = getRandomInt(_allFilesLength);
      let entry = _allFiles[n];
      if (entry) {
        let fileInfo = extractInfoFromName(entry);
        next.push(fileInfo);
      } else {
        console.log(entry);
      }

    } catch (error) {
      console.log(error);
    }
  }

  res.json(next);

});

/*
app.post("/api/erasemusic", async function (req, res) {
  console.log("erasemusic", req.body);

  let {fullpath} = req.body;

  const pos = fullpath.indexOf("/static") + "/static".length;

  let path = musicSrcPath + fullpath.slice(pos);

  fse.unlinkSync(path);
  res.status(200);
});
*/

module.exports = router;