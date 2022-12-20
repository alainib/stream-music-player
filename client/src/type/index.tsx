export type Mp3 = { id: string; title: string; artist: string; album: string; genre: string; img: string; path: string };

export function newMp3() {
  return {
    id: '',
    title: '',
    artist: '',
    album: '',
    genre: '',
    img: '',
    path: '',
  };
}
