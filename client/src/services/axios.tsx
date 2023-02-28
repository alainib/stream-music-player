import { default as axios } from 'axios';
import authHeader from './auth-header';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:3001',
  timeout: 15000,
  headers: { ...authHeader() },
});

const postConfig = {
  method: 'POST',
  headers: { Accept: 'application/json', 'Content-type': 'application/json; charset=UTF-8', ...authHeader() },
};

export { instance, postConfig };
