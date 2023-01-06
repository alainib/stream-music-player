
var express = require('express');
var router = express.Router();
const axios = require('axios');
const config = require('./config.js');
const {extractInfoFromPath} = require('./tools/index.js');

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

router.get('/api/getrandommusic', async function (req, res) {
  if (config.useStaticDatas) {
    res.status(200).json(config.staticDatas);
  } else {
    try {

      const response = await instance.post(config.elasticIndexUrl, {
        "size": 15,
        "query": {"function_score": {"query": {"match_all": {}}, "random_score": {}}}
      });

      const d = response.data?.hits?.hits
        .filter((elem) => {
          const {filename} = extractInfoFromPath(elem?._source?.path);
          const test = !filename?.startsWith(".");
          if (!test) {
            console.log("this filename start with a dot: " + filename)
          }
          return test;
        })
        .map((elem) => ({
          id: elem._id || elem.id,
          ...elem?._source,
          path: cleanFilePath(elem?._source?.path),
        }));
      res.status(200).json(d)

    } catch (err) {
      console.log(err)
      res.status(500).json({message: err});
    }
  }

});

router.post('/api/getaggs', async function (req, res) {
  const {search, field} = req.body;
  try {
    // subaggs to get path for image
    const subaggs = {
      "path": {
        "terms": {
          "size": 1,
          "field": "path.keyword"
        }
      }
    };
    const response = await instance.post(config.elasticIndexUrl, {
      "size": 0,
      "aggs": {
        /* "titre": {        "terms": {             "size": 25,           "field": "titre.keyword_not_normalized"          }        },*/
        "album": {
          "terms": {
            "size": 250,
            "field": "album.keyword_not_normalized"
          }
        },
        "genre": {
          "terms": {
            "size": 50,
            "field": "genre.keyword_not_normalized"
          },
          aggs: subaggs

        },
        "artist": {
          "terms": {
            "size": 250,
            "field": "artist.keyword_not_normalized"
          }
        }
      }
    });

    const aggregations = {
      genre: response.data?.aggregations?.genre?.buckets.map(({key, doc_count, path}) => ({key, doc_count, path: path?.buckets?.[0]?.key})),
      album: response.data?.aggregations?.album?.buckets,
      artist: response.data?.aggregations?.artist?.buckets
    }

    res.status(200).json(aggregations)

  } catch (err) {
    console.log("error in /api/getaggs")
    console.log(err)
    res.status(500).json({message: err});
  }

});

router.post('/api/getmusicof', async function (req, res) {
  const {search, field} = req.body;

  try {
    const response = await _searchMusicOf({search, field});
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err)
    res.status(500).json({message: err});
  }
});


async function _searchMusicOf({search, field}) {

  console.log("calling api searchMusicOf", {search, field})

  if (!!search && !!field) {
    let match = {}
    match[field + ".keyword"] = search;

    const response = await instance.post(config.elasticIndexUrl, {
      "query": {
        "bool": {
          "must": [{
            "match": match
          }
          ]
        }
      },
      "size": 100
    });

    return response
  } else {
    console.log(`error calling api searchMusicOf with empty args. search :${search} ; field: ${field}`);
    return []
  }

}

function cleanFilePath(path = "") {
  return path.replace(config.musicSrcPath, "");
}




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