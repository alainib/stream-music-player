import { instance, postConfig } from './axios';

export async function runQuery({ url = '/api/search', typeOfQuery = 'post', search = '', field = null }) {
  let status, data, response;
  try {
    switch (typeOfQuery) {
      case 'post':
        response = await instance.post(url, { search, field }, postConfig);
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

export async function deleteTrack(fullpath = '') {
  const url = '/erasemusic';
  let status, data;
  try {
    const response = await instance.post(url, { fullpath }, postConfig);

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
