import { Box } from '@mui/material';
import { BucketType } from '../type';
import ButtonGBImage from './ButtonGBImage';
import Config from '../Config';

let size = 200;
if (window.innerWidth < 600) {
  size = 100;
} else if (window.innerWidth <= 800) {
  size = 125;
} else if (window.innerWidth <= 1200) {
  size = 150;
}

const classes = {
  container: {
    minHeight: '150px',
    maxHeight: '375px',
    marginTop: Config.spacings.small,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, ${size + 10}px)`,
  },

  label: {
    fontSize: Config.fontSizes.medium,
  },
};

type BucketProps = {
  data: BucketType[];
  label: string;
};
console.log(size)

export default function Bucket({ data, label }: any) {
  const isData = !!data && data?.length > 0;
  return (
    <Box sx={classes.container} id="BucketComponent">
      <Box sx={classes.label}>{label}</Box>
      {isData && (
        <Box sx={classes.grid}>
          {data.map((elem: BucketType, index: number) => (
            <ButtonGBImage src={elem.path} id={elem.key} size={size} label={elem.key} />
          ))}
        </Box>
      )}
    </Box>
  );
}
