import Config from '../Config';
import { extractInfoFromPath } from '../tools';

type AudioType = {
  src: string;
  handleOnEndOfTrack: () => void;
};

export default function AudioPlayer({ src, handleOnEndOfTrack }: AudioType) {
  if (!!src && src !== '') {
    const { filename, pathToParentFolder } = extractInfoFromPath(src);
    // 
    return <audio autoPlay onEnded={handleOnEndOfTrack}  controls src={Config.static_path + '/' + pathToParentFolder + '/' + filename} />;
  } else {
    return <>Audio file not available, try next ?</>;
  }
}
