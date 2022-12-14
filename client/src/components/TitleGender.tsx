import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Mp3 } from '../type';
import { upperFirstLetter } from '../tools';

type TitleGenderProps = {
  mp3: Mp3; 
  // if true display small text and album+gendre under title. if not all on the same row
  twoRows?: boolean;
  smallText?: boolean;
};

export default function TitleGender({ mp3, twoRows = false, smallText = false }: TitleGenderProps) {
  const title = upperFirstLetter(mp3?.title);
  const album = upperFirstLetter(mp3?.album);
  const genre = upperFirstLetter(mp3?.genre?.replace('rap francais', 'rap fr'));

  let style = { alignItems: 'flex-start', display: 'flex', color: 'white'  };
  let styleSub = { color: 'rgb(243, 244, 246)' };

  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Grid item xs={twoRows ? 12 : 5}>
        {renderTitle()}
      </Grid>
      <Grid item xs={!twoRows && 4}>
        {renderAlbum()}
      </Grid>
      <Grid item xs={!twoRows && 3}>
        {renderGenre()}
      </Grid>
    </Grid>
  );
 
  function renderTitle() {
    return (
      <Typography
        id="typo"
        variant={smallText ? 'body1' : 'h4'}
        color="text.primary"
        fontWeight={smallText ? 400 : 500}
        sx={{
          maxWidth: 'min(30ch,94vw)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          ...style,
        }}
      >
        {title}
      </Typography>
    );
  }

  function renderAlbum() {
    return (
      <Typography
        variant="body2"
        id="fuck"
        sx={{ maxWidth: '28ch', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...styleSub }}
      >
        {album}
      </Typography>
    );
  }
  function renderGenre() {
    return (
      <Typography variant="body2" sx={styleSub}>
        <i>{genre}</i>
      </Typography>
    );
  }
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
