import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Mp3 } from '../type';
import { upperFirstLetter } from '../tools';

export default function TitleGender(mp3: Mp3) {
  const title = upperFirstLetter(mp3?.title);
  const album = upperFirstLetter(mp3?.album);
  const genre = upperFirstLetter(mp3?.genre);

  const compact = false;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', height: '100%' }}>
      <Typography
        variant={compact ? 'h5' : 'h4'}
        color="text.primary"
        fontWeight={compact ? 300 : 500}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {title}
      </Typography>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end">
        <Grid item>
          <Typography variant="body2" color="text.secondary">
            {album}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="text.secondary">
            <i>{genre}</i>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  /*
    small 

    <React.Fragment>
      <Typography component="div" variant="body2" color="text.primary">
        {title}
      </Typography>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end">
        <Grid item>
          <Typography variant="body2" color="text.primary">
            {album}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="text.primary">
            <i>{genre}</i>
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>

    big

   <Typography
    variant="h4"
    color="text.secondary"
    fontWeight={500}
    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
  >
    {title}
  </Typography>

  <Typography variant="h5" noWrap color="text.secondary">
    {album}
  </Typography>

  <Typography variant="h6" noWrap color="text.secondary">
    {genre}
  </Typography>
  */
}
