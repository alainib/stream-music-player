import { useState } from 'react';
import { Slider, Box } from '@mui/material';

type SlideProps = {
  size: number;
  handleSize: (size: number) => void;
};

export default function SizeSlider({ size, handleSize }: SlideProps) {
  const [nsize, setSize] = useState<number>(size);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setSize(newValue);
    }
  };

  const handleCommited = (event: React.SyntheticEvent | Event, value: number | number[]) => {
    if (typeof value === 'number') {
      handleSize(value);
    }
  };

  return (
    <Box
      id="SizeSlider"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Slider
        sx={{ width: 'min(80%,400px)' }}
        aria-label="Taille_vignettes"
        defaultValue={size}
        value={nsize}
        getAriaValueText={() => 'valuetext'}
        valueLabelDisplay="auto"
        step={20}
        marks
        min={75}
        max={250}
        onChange={handleChange}
        onChangeCommitted={handleCommited}
      />
    </Box>
  );
}
