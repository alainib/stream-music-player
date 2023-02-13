import Box from '@mui/material/Box';
import Config from '../../Config';
import { pathToFolderImageFromPath } from '../../tools';

type CoverImageType = {
  url: string;
};

export default function BackgroundImage({ url }: CoverImageType) {

  const src =  pathToFolderImageFromPath(url, "large");
  const style = {
    objectFit: 'cover',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.08)',
    height: Config.imageSize,
    width: Config.imageSize,
    background: `url(${src})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  return <Box sx={style} id="CoverImage"/>;
}
