import { useState, useEffect } from 'react';
import { pathToFolderImageFromPath } from '../tools';
import dlgif from '../assets/dl.gif';

type ImageType = {
  src: string;
};

export default function Image({ src }: ImageType) {
  /*
  if i == 0 use folder_400.jpg 
  if i == 1 use dlgif
  */
  const [errorsCatched, setErrorsCatched] = useState(0);

  useEffect(() => {
    setErrorsCatched(0);
  }, [src]);

  return (
    <img
      src={src}
      style={{
        width: '100%',
        height: '100%',
      }}
      onError={(e) => {
        const target = e.target as HTMLSourceElement;
        if (errorsCatched === 0) {
          target.src = pathToFolderImageFromPath(src);
        } else {
          target.src = dlgif;
        }
        setErrorsCatched(errorsCatched + 1);
      }}
    />
  );
}
