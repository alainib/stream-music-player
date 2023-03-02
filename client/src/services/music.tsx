import { instance, postConfig } from './axios';

type RunQueryProps = {
  typeOfQuery: string;
  url: string;
  showHits?: boolean;
  filters?: {};
};

export async function runQuery({ url = '', typeOfQuery = 'post', filters = {}, showHits = false }: RunQueryProps) {
  let status, data, response;
  if (url === '') {
    console.log('error runQuery, url is null');
    return false;
  }

  try {
    switch (typeOfQuery) {
      case 'post':
        response = await instance.post(url, { filters, showHits }, postConfig);
        break;
      default:
        response = await instance.get(url);
        break;
    }

    status = response.status;
    data = response.data;
  } catch (error) {
    console.error(error);
    status = 404;
  }
  if (status === 200) {
    return data;
  } else {
    return false;
  }
}

export async function deleteTrack(path = '', id = '') {
  try {
    const response = await instance.post('/api/erasemusic', { path, id }, postConfig);
    return response.status === 200;
  } catch (error) {
    console.error(error);
  }
  return false;
}
