import * as axios from "services/axios";

export async function nextMusic() {
  const url = "/next";

  let status, data;
  try {
    const response = await axios.instance.get(url);
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

export async function deleteTrack(fullpath) {
  const url = "/erasemusic";
  let status, data;
  try {
    const response = await axios.instance.post(
      url,
      { fullpath },
      axios.postConfig
    );

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
