export default function authHeader() {
  try {
    const user = JSON.parse(localStorage?.getItem('user') || '');
    if (user && user.accessToken) {
      return { 'x-access-token': user.accessToken };
    }
  } catch (error) {}

  return {};
}
