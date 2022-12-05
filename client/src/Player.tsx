import React, { useState, useEffect } from 'react';

import { searchMusic } from './services/music';

import ReactJkMusicPlayer from 'react-jinke-music-player';
import 'react-jinke-music-player/assets/index.css';

//const jsmediatags = window.jsmediatags;

let initOptions = {
  audioLists: [],
  theme: 'dark',
  remove: true,
  mode: 'full',
  showLyric: false,
  preload: true,
  autoPlay: true,
  clearPriorAudioLists: true,
};

export function Player() {
  const [datas, setDatas] = useState(null);

  const search = async () => {
    const res = await searchMusic();
    setDatas(res);
    console.log(res)
  };

  useEffect(() => {
    search();  

    return () => {};
  });
  return <div>player</div>;
}
