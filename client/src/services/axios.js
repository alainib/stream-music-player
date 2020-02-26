import * as axios from "axios";
import Config from "Config";
let instance = axios.create();

instance.defaults.baseURL = Config.api_path;
instance.defaults.timeout = 5000;

 
export { instance };
