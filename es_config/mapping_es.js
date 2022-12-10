------------------------- index name -------------------------

listmp3

------------------------- settings -------------------------

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
    "type": "text"
  },

  "year": {
    "type": "long"
  }

}
 
-------------------------
Champ title  analysé => recherche avec des query fulltext
Champ title.keyword pas analysé et normalisé en lowercase sans accent => tri
Champ title.keyword_not_normalized pas analysé et pas normalisé(brut de pomme) => aggrégations + filtres


---------------------------------------------------------------------------

GET listmp3 / _search
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

{
  "_source": {
    "includes": "*"
  },
  "size": 100,
  "track_total_hits": true,
  "aggs": {
    "titre": {
      "terms": {
        "size": 100,
        "field": "titre.keyword_not_normalized"
      }
    },
    "album": {
      "terms": {
        "size": 100,
        "field": "album.keyword_not_normalized"
      }
    },
    "genre": {
      "terms": {
        "size": 100,
        "field": "genre.keyword_not_normalized"
      }
    },
    "artist": {
      "terms": {
        "size": 100,
        "field": "artist.keyword_not_normalized",
        "order": {
          "_key": "asc"
        }
      }
    }
  }
}
