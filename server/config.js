const elasticIndexBaseUrl = "/listmp3_v3";

const config = {
  frontIp: 'localhost:3000',
  apiIp: '127.0.0.1',
  apiPort: 3001,
  elastic: {
    useES: true,
    url: "http://127.0.0.1:9200",
    userName: 'elastic',
    password: 'elastic321',
    indexBaseUrl: elasticIndexBaseUrl,
    indexUrl: elasticIndexBaseUrl + "/_search",
  },
  kibanaUrl: "http://localhost:5601/",
  // path to music in external storage like NAS or server
  musicSrcPath: "/Volumes/Multimedia/music",
  staticFileIp: "http://78.202.14.12:3001/",

  jwtTokenSecret: '8450103c06dbd58add9d047d761684096ac560ca',

};

module.exports = config;