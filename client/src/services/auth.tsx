import { instance, postConfig } from './axios';

export async function register(props: object) {
  return await instance.post('/user/signup', props, postConfig);
}

export async function sigin(props: object) {
  try {
    if (typeof props !== 'object') {
      console.error('auth.tsx sigin props should be object');
      return null;
    }

    const { status, data } = await instance.post('api/user/signin', props, postConfig);
    if (status === 200 && data.accessToken) {
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function signout() {
  localStorage.removeItem('user');
}
