------------------------- index name -------------------------

listmp3_v3

------------------------- index settings -------------------------

{
  "number_of_shards": 1,
    "analysis": {
    "normalizer": {
      "lowercase_no_accent": {
        "type": "custom",
          "filter": [
            "lowercase",
            "asciifolding"
          ]
      }
    }
  }
}

------------------------- mappings -------------------------

{
  "title": {
    "type": "text",
    "analyzer": "standard",
    "fields": {
      "keyword": {
        "type": "keyword",
        "ignore_above": 256,
        "normalizer": "lowercase_no_accent"
      },
      "keyword_not_normalized": {
        "type": "keyword",
        "ignore_above": 256
      }
    }
  },
  "album": {
    "type": "text",
    "analyzer": "standard",
    "fields": {
      "keyword": {
        "type": "keyword",
        "ignore_above": 256,
        "normalizer": "lowercase_no_accent"
      },
      "keyword_not_normalized": {
        "type": "keyword",
        "ignore_above": 256
      }
    }
  },
  "artist": {
    "type": "text",
    "analyzer": "standard",
    "fields": {
      "keyword": {
        "type": "keyword",
        "ignore_above": 256,
        "normalizer": "lowercase_no_accent"
      },
      "keyword_not_normalized": {
        "type": "keyword",
        "ignore_above": 256
      }
    }
  },
  "genre": {
    "type": "text",
    "analyzer": "standard",
    "fields": {
      "keyword": {
        "type": "keyword",
        "ignore_above": 256,
        "normalizer": "lowercase_no_accent"
      },
      "keyword_not_normalized": {
        "type": "keyword",
        "ignore_above": 256
      }
    }
  },
  "path": {
    "type": "text",
    "analyzer": "standard",
    "fields": {
      "keyword": {
        "type": "keyword",
        "ignore_above": 256,
        "normalizer": "lowercase_no_accent"
      }
    }
  },

  "year": {
    "type": "long"
  },
  "rating": {
    "type": "long"
  }
}

 
-------------------------
Champ title  analysé => recherche avec des query fulltext
Champ title.keyword pas analysé et normalisé en lowercase sans accent => tri
Champ title.keyword_not_normalized pas analysé et pas normalisé (brut de pomme) => aggrégations + filtres


-------------------------------- DELETE WITH QUERY  ------------------------------------------

POST /listmp3_v3/_delete_by_query
{
  "query": {
    "bool": {
      "must": [
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "term": {
                  "album.keyword": "arabe à trier"
                }
              }
            ]
          }
        }
      ]
    }
  }
}


-------------------------------- import post bulk mode  ------------------------------------------
POST listmp3_v2/_bulk
{ "index" : {  } }
{"title":"ayoub hattab x rkov x nada - bla matsennani (music video)  (بلا متسناني (حصريآً","genre":"arabe","artist":"arabe","album":"arabe à trier","path":"/AYOUB HATTAB x RKOV x NADA - Bla Matsennani (Music Video)   (بلا متسناني (حصريآً.mp3","rating":0,"id":"_AYOUB_HATTAB_x_RKOV_x_NADA_-_Bla_Matsennani_(Music_Video)___(بلا_متسناني_(حصريآً.mp3"}
{ "index" : {  } }
{"title":"abeer nehme - bi saraha  عبير نعمة - بصراحة","genre":"arabe","artist":"arabe","album":"arabe à trier","year":2022,"path":"/Abeer Nehme - Bi Saraha   عبير نعمة - بصراحة.mp3","rating":0,"id":"_Abeer_Nehme_-_Bi_Saraha___عبير_نعمة_-_بصراحة.mp3"}
{ "index" : {  } }
{"title":"abeer nehme - shou baamel  عبير نعمة - شو بعمل","genre":"arabe","artist":"arabe","album":"arabe à trier","year":2022,"path":"/Abeer Nehme - Shou Baamel   عبير نعمة - شو بعمل.mp3","rating":0,"id":"_Abeer_Nehme_-_Shou_Baamel___عبير_نعمة_-_شو_بعمل.mp3"}
{ "index" : {  } }


---------------------------------------------------------------------------



GET listmp3_v3/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "wildcard": {
            "album.keyword": {
              "value": "best*"
            }
          }
        }
      ]
    }
  },
  "_source": {
    "includes": "*"
  },
  "size": 10,
    "track_total_hits": true,
      "aggs": {
    "titre": {
      "terms": {
        "size": 25,
          "field": "album.keyword_not_normalized"
      }
    },
    "album": {
      "terms": {
        "size": 25,
          "field": "album.keyword_not_normalized"
      }
    },
    "genre": {
      "terms": {
        "size": 25,
          "field": "album.keyword_not_normalized"
      }
    },
    "artist": {
      "terms": {
        "size": 25,
          "field": "album.keyword_not_normalized"
      }
    }
  }
}



---------
GET listmp3_v3/_search
{
  "size": 15,
  "query": {
    "function_score": {
      "query": {
        "match_all": {}
      },
      "random_score": {}
    }
  }
}

GET listmp3_v3/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "album.keyword": "sang froid"
          }
        }
      ]
    }
  },
  "size": 100
}
 



GET listmp3_v3/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "wildcard": {
            "artist.keyword": {
              "value": "Sinik*"
            }
          }
        }
      ]
    }
  },
  "_source": {
    "includes": "*"
  },
  "size": 10,
  "track_total_hits": true,
  "aggs": {
    "titre": {
      "terms": {
        "size": 25,
        "field": "titre.keyword_not_normalized"
      }
    },
    "album": {
      "terms": {
        "size": 25,
        "field": "album.keyword_not_normalized"
      }
    },
    "genre": {
      "terms": {
        "size": 25,
        "field": "genre.keyword_not_normalized"
      }
    },
    "artist": {
      "terms": {
        "size": 25,
        "field": "artist.keyword_not_normalized"
      }
    }
  }
}
