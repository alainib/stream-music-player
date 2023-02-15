const config = {
  frontIp: 'localhost:3000',
  apiIp: '127.0.0.1',
  apiPort: 3001,
  elasticUrl: "http://127.0.0.1:9200",
  elasticUserName: 'elastic',
  elasticPassword: 'elastic321',
  elasticIndexUrl : "/listmp3_v3/_search",
  kibanaUrl: "http://localhost:5601/",
  // path to music in external storage like NAS or server
  musicSrcPath: "/Volumes/Multimedia/music",
  staticFileIp:"http://78.202.14.12:3001/"
};

module.exports = config ;