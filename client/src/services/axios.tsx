import { default as axios } from 'axios'

const instance = axios.create({
  baseURL: "http://127.0.0.1:3001",
  timeout: 15000, 
  headers: {Accept: "application/json", "Content-Type": "application/json"}
});


const postConfig = {
  method: "POST",
  headers: {Accept: "application/json", "Content-Type": "application/json"}
};
export {instance, postConfig};
