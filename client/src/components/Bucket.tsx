import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { BucketType } from '../type';
import ButtonBGImage from './widgets/ButtonBGImage';
import Config from '../Config';

import useDebounce from '../hooks/useDebounce';

const _DEBOUNCETIMEOUT = 1000;

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
 

  const [selection, setSelection] = useState<string[]>([]);

  const debouncedSelection = useDebounce(selection, _DEBOUNCETIMEOUT);

  useEffect(() => {
    if (debouncedSelection?.length > 0) {
      onSelect(debouncedSelection);
    }
  }, [debouncedSelection]);

  return (
    <Box sx={classes.container} id="BucketComponent">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, ${vignetsSize + 10}px)`,
        }}
      >
        {renderData()}
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
          onClick={() => handleOnSelect(elem.key)}
        />
      ));
    } else {
      return null;
    }
  }

  function handleOnSelect(newkey: string) {
    setSelection([...selection, newkey]);
    return null;
  }
}
