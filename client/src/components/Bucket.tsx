import { useMemo } from 'react';

import { Box } from '@mui/material';
import { BucketType } from '../type';
import ButtonBGImage from './widgets/ButtonBGImage';
import Config from '../Config';

const classes = {
  container: {
    minHeight: '150px',
    maxHeight: '375px',
    marginTop: Config.spacings.small,
  },
};

type BucketProps = {
  data: BucketType[];
  vignetsSize: number;
  onSelect: (label: string) => null;
};

export default function Bucket({ data, vignetsSize = 200, onSelect }: any) {
  const isData = !!data && data?.length > 0;

  const memoizedData = useMemo(() => renderData(), [data]);

  return (
    <Box sx={classes.container} id="BucketComponent">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, ${vignetsSize + 10}px)`,
        }}
      >
        {memoizedData}
      </Box>
    </Box>
  );

  function renderData() {    
    if (isData) {
      return data?.map((elem: BucketType, index: number) => (
        <ButtonBGImage
          src={elem.path}
          id={elem.key}
          key={elem.key}
          size={vignetsSize}
          colorFromLabel
          label={elem.key}
          onSelect={() => onSelect(elem.key)}
        />
      ));
    } else {
      return null;
    }
  }
}
