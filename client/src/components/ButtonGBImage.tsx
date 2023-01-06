import { styled } from '@mui/material/styles';
import { ButtonBase, Box } from '@mui/material';
import Config from '../Config';
import { upperFirstLetter, randomColor } from '../tools';
import Image from './Image';

const Label = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 10,
  top: 10,
  color: theme.palette.common.white,
  textShadow: 'rgb(0, 0, 0) 1px 0px 0px, rgb(0, 0, 0) 0.540302px 0.841471px 0px, rgb(0, 0, 0) -0.416147px 0.909297px 0px, rgb(0, 0, 0) -0.989992px 0.14112px 0px, rgb(0, 0, 0) -0.653644px -0.756802px 0px, rgb(0, 0, 0) 0.283662px -0.958924px 0px, rgb(0, 0, 0) 0.96017px -0.279415px 0px',
  zIndex: 1,
  fontWeight: Config.fontWeights.semibold,
  fontSize: Config.fontSizes.ml,
  fontFamily: 'monospace',
  textAlign: 'start'
}));

type ButtonGBImageProps = {
  label: string;
  src: string;
  id: string;
  size: number;
};

export default function ButtonGBImage({ src, id, size, label }: ButtonGBImageProps) {
  return (
    <ButtonBase
      focusRipple
      key={id}
      sx={(theme) => ({
        margin: '5px',
        position: 'relative',
        height: size,
        width: size,
        backgroundColor: randomColor(),
        borderRadius: 3,
        [theme.breakpoints.down('sm')]: {
          width: '100% !important', // Overrides inline-style
          height: 100,
        },
        '&:hover': {
          '& .MuiImageBackdrop-root': {
            opacity: 1,
          },
        },
        overflow: 'hidden'
      })}
    >
      <Label> {upperFirstLetter(label)} </Label>
      <Box
        className="MuiImageBackdrop-root"
        sx={{
          position: 'absolute',
          right: -10,
          bottom: -12,
          width: size / 1.3,
          height: size / 1.3,
          transform: 'rotate(9deg)',
        }}
      >
        <Image src={src} />
      </Box>
    </ButtonBase>
  );
}
