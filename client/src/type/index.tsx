export type Mp3 = { id: string; title: string; artist: string; album: string; genre: string; img: string; path: string; rating?: number };

export function newMp3() {
  return {
    id: '',
    title: '',
    artist: '',
    album: '',
    genre: '',
    img: '',
    path: '',
    rating: 0,
  };
}

export type BucketsType = {
  genre: BucketType[];
  artist: BucketType[];
  album: BucketType[];
};

export function newBuckets() {
  return {
    genre: [],
    artist: [],
    album: [],
  };
}

export type BucketType = {
  key: string;
  doc_count: number;
  path: string;
};

export type ChangePlaylistProps = {
  changePlaylist: (list: Mp3[], index: number, label: string) => null;
};

export type Filters = {
  title?: string | string[];
  artist?: string | string[];
  album?: string | string[];
};
