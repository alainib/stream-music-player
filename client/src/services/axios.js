import * as axios from "axios";
import Config from "Config";
let instance = axios.create();

instance.defaults.baseURL = Config.api_path;
instance.defaults.timeout = 15000;

const postConfig = {
  method: "POST",
  headers: { Accept: "application/json", "Content-Type": "application/json" }
};
export { instance, postConfig };
