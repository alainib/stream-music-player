
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

      res.status(200).json(cleanHits(response.data))

    } catch (err) {
      console.log(err)
      res.status(500).json({message: err});
    }
  }

});



router.post('/api/getaggs', async function (req, res) {
  const {filters} = req.body;
  console.log("/api/getaggs", filters)

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
      query: createQueryFromFilters(filters),
      "aggs": {
        /* "titre": {        "terms": {             "size": 25,           "field": "titre.keyword_not_normalized"          }        },*/
        "album": {
          "terms": {
            "size": 250,
            "field": "album.keyword_not_normalized"
          },
          aggs: subaggs
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
          },
          aggs: subaggs
        }
      }
    });

    const aggregations = {
      genre: cleanData(response.data?.aggregations?.genre?.buckets),
      album: cleanData(response.data?.aggregations?.album?.buckets),
      artist: cleanData(response.data?.aggregations?.artist?.buckets)
    }
    setTimeout(() => {
      res.status(200).json(aggregations)
    }, 2000);

  } catch (err) {
    console.log("error in /api/getaggs")
    console.log(err)
    res.status(500).json({message: err});
  }

  function cleanData(buckets) {
    return buckets.map(({key, doc_count, path}) => ({key, doc_count, path: path?.buckets?.[0]?.key}))
  }
});



router.post('/api/getmusicof', async function (req, res) {
  const {filters} = req.body;
  console.log("/api/getmusicof", req.body)
  try {
    const response = await instance.post(config.elasticIndexUrl, {
      "size": 150,
      query: createQueryFromFilters(filters)
    });
    res.status(200).json(cleanHits(response.data))
  } catch (err) {
    console.log(err)
    res.status(500).json({message: err});
  }
});


function createQueryFromFilters(filters) {
  /*  aggs must need  :

  query: {
    "bool": {
      "must": [
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {"term": {"genre.keyword": "rap americain"}}
            ]
          }
        },
        {
          "bool": {
            // to do a AND query, minimum_should_match should be equal to the number or term , so 4 her. 
            // to do a OR query, minimum_should_match should be equal to 1
            "minimum_should_match": 1,
            "should": [
              {"term": {"artist.keyword": "50 cent"}},
              {"term": {"artist.keyword": "eminem"}}
            ]
          }
        }
      ]
    }
  },
  */

  const availableFieldNames = ['genre', 'artist', 'album'];

  let must = [];

  for (const propertyName in filters) {
    if (filters[propertyName].length > 0 && availableFieldNames.includes(propertyName)) {
      let newShouldForMust = [];
      for (const value of filters[propertyName]) {
        newShouldForMust.push({"term": {[propertyName + ".keyword"]: value}})
      }
      if (newShouldForMust?.length > 0) {
        must.push({
          "bool": {
            "minimum_should_match": /*useAndQuery ? newShouldForMust?.length :*/ 1,
            "should": newShouldForMust
          }
        });
      }

    }
  }

  const query = {
    "bool": {
      "must": must
    }
  };

  console.log(JSON.stringify(query, null, 2));

  return query
}


function cleanFilePath(path = "") {
  return path.replace(config.musicSrcPath, "");
}

function cleanHits(responseData) {
  return responseData?.hits?.hits
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