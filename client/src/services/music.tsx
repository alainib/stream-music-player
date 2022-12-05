import * as axios from "./axios";


export async function searchMusic(search = "") {
  const url = "/listmp3/_search";

  let status, data;
  try {
    const response = await axios.instance.post(url, {
      "query": {
        "bool": {
          "must": [{
            "wildcard": {
              "title.keyword": {
                "value": search + "*"
              }
            }
          }]
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

    status = response.status;
    data = response.data;
  } catch (error) {
    console.error(error);
    status = 404;
  }
  if (status === 200) {
    return data;
  } else {
    return false;
  }
}

export async function deleteTrack(fullpath="") {
  const url = "/erasemusic";
  let status, data;
  try {
    const response = await axios.instance.post(
      url,
      {fullpath},
      axios.postConfig
    );

    status = response.status;
    data = response.data;
  } catch (error) {
    console.error(error);
    status = 404;
  }
  if (status === 200) {
    return data;
  } else {
    return false;
  }
}
