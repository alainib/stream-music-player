import Config from '../Config';
import { extractInfoFromPath } from '../tools';

type AudioType = {
  src: string;
  handleOnEnd: () => void;
};

export default function AudioPlayer({ src, handleOnEnd }: AudioType) {
  if (!!src && src !== '') {
    const { filename, pathToParentFolder } = extractInfoFromPath(src);
    return <audio onEnded={handleOnEnd} autoPlay controls src={Config.static_path + pathToParentFolder + '/' + filename} />;
  } else {
    return <>Audio file not available, try next ?</>;
  }
}
