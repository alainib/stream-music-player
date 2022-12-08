import React, { useState, useEffect } from 'react';
import Config from '../Config';
import dlgif from '../assets/dl.gif';

type ImageType = {
  src: string;
};

export default function Image({ src }: ImageType) {
  /*
  if i == 0 use folder.jpg 
  if i == 1 use dlgif
  */
  const [errorsCatched, setErrorsCatched] = useState(0);

  useEffect(() => {
    setErrorsCatched(0);
  }, [src]);

  return (
    <img
      src={src}
      onError={(e) => {       
        const target = e.target as HTMLSourceElement;
        if (errorsCatched == 0) {
          target.src = getFolderPath(src);
        } else {
          target.src = dlgif;
        }
        setErrorsCatched(errorsCatched + 1);
      }}
    />
  );
}

function getFolderPath(fullpath: string) {
  return fullpath.substring(0, fullpath.lastIndexOf('/')) + '/folder.jpg';
}
