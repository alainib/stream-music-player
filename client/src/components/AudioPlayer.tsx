import React, { useState, useEffect } from 'react';
import Config from '../Config';
import { extractInfoFromName } from '../tools';

type AudioType = {
  src: string;
  handleOnEnd: () => void;
};

export default function AudioPlayer({ src, handleOnEnd }: AudioType) {
  if (!!src && src !== '') {
    const { filename, pathToParentFolder } = extractInfoFromName(src);
    return (
      <audio onEnded={handleOnEnd} autoPlay controls src={Config.static_path + pathToParentFolder + '/' + encodeURIComponent(filename)} />
    );
  } else {
    return <>Audio file not available, try next ?</>;
  }
}
