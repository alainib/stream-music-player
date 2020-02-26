const local_api_path = "localhost:1002";


let api_path = "http://";
let static_path = "http://";

if (window.location.hostname === "localhost") {
  api_path += local_api_path;
  static_path += local_api_path;
} else {
  api_path += window.location.host;
  static_path += window.location.host;
}

api_path += "/api";
static_path += "/static";
 

export default {
  api_path,
  static_path   
};
