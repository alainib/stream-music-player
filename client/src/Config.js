const local_api_path = 'localhost:1002';
const distant_api_path = '88.190.14.12:1002';

const useDistante = true;

let api_path = 'http://';
let static_path = 'http://';

if (useDistante) {
  api_path += distant_api_path;
  static_path += distant_api_path;
} else if (window.location.hostname === 'localhost') {
  api_path += local_api_path;
  static_path += local_api_path;
} else {
  api_path += window.location.host;
  static_path += window.location.host;
}

api_path += '/api';
static_path += '/static';

export default {
  api_path,
  static_path
};
