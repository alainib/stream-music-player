import React from 'react';
import { useEventPublisher } from 'use-event-emitter-hook';
import { ButtonBase, Typography, Grid, Box, Rating, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Mp3 } from '../type';
import { upperFirstLetter } from '../tools';
import Config from '../Config';
import { useUserContext } from '../context/UserContext';
import { deleteTrack } from '../services/music';

type Mp3InfoProps = {
  mp3: Mp3;
  onSearch?: (s: string, type: string) => Promise<null>;
  compact?: boolean;
  smallText?: boolean;
};

const classes = {
  titleStyle: {
    flex: 1,
    color: Config.colors.white,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    alignItems: 'flex-start',
    display: 'flex',
    width: '100%',
  },
  styleSub: {
    fontSize: Config.fontSizes.small,
  },
  flexStart95: {
    width: '95%',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
  },
  spaceBetween: {
    display: 'flex',
    width: '96%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

export default function Mp3Info({ mp3, compact = false, smallText = false, onSearch }: Mp3InfoProps) {
  const title = upperFirstLetter(mp3?.title);
  const album = upperFirstLetter(mp3?.album);
  const artist = upperFirstLetter(mp3?.artist);
  const genre = upperFirstLetter(mp3?.genre);

  let publisher = useEventPublisher();

  const { user } = useUserContext();

  if (compact) {
    return (
      <Box
        id="notcompact"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }}
      >
        <Box id="boxTitle" sx={classes.spaceBetween}>
          <Box id="boxTitle" sx={classes.flexStart95}>
            {renderTitle()}
          </Box>
          {renderDeleteButton()}
        </Box>
        <Box id="boxalbum" sx={classes.flexStart95}>
          {renderAlbum()}
        </Box>
        <Box
          id="boxartistgenre"
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '95%',
          }}
        >
          {renderArtist()}
          {renderGenre()}
        </Box>
        <Box
          id="boxrating"
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '95%',
          }}
        >
          {renderRating()}
        </Box>
      </Box>
    );
  } else {
    return (
      <Grid id="compact" container direction="row" justifyContent="space-between" alignItems="center">
        <Grid id="boxtitlec" item xs={8} sx={classes.flexStart95}>
          <Box>{renderTitle()}</Box>
          <Box> {renderAlbum()}</Box>
          <Box> {renderRating()}</Box>
        </Grid>
        <Grid id="boxartistc" item xs={4} sx={classes.flexStart95}>
          <Box id="boxTitle" sx={classes.spaceBetween}>
            <Box id="boxTitle" sx={classes.flexStart95}>
              {renderArtist()}
            </Box>
            {renderDeleteButton()}
          </Box>

          <Box> {renderGenre()}</Box>
        </Grid>
      </Grid>
    );
  }
  function renderRating() {
    return (
      <Rating
        name="read-only"
        value={mp3?.rating}
        readOnly
        size="small"
        sx={{
          '& .MuiRating-iconFilled': {
            color: Config.colors.white,
          },
        }}
      />
    );
  }

  function renderTitle() {
    return (
      <Typography
        noWrap
        id="typoTitle"
        variant={smallText ? 'body1' : 'h4'}
        color="text.primary"
        fontWeight={smallText ? Config.fontWeights.normal : Config.fontWeights.medium}
        sx={classes.titleStyle}
      >
        {title}
      </Typography>
    );
  }

  function renderArtist() {
    return renderButton(artist, 'artist');
  }

  function renderAlbum() {
    return renderButton(album, 'album');
  }

  function renderGenre() {
    return renderButton(genre, 'genre', true);
  }

  function renderButton(s: string, type: string, italic: boolean = false) {
    return (
      <ButtonBase onClick={() => !!onSearch && onSearch(s, type)}>
        <Typography variant="body2" sx={[classes.titleStyle, classes.styleSub]}>
          {italic ? <i>{s}</i> : s}
        </Typography>
      </ButtonBase>
    );
  }

  function renderDeleteButton() {
    if (user?.admin) {
      return (
        <IconButton aria-label="next song" onClick={handleDelete}>
          <DeleteIcon fontSize="small" htmlColor={Config.colors.gray} />
        </IconButton>
      );
    }
    return null;
  }

  async function handleDelete() {
    const succes = await deleteTrack(mp3?.path, mp3?.id);
    console.log('deleteTrack', succes);
    if (succes) {
      publisher('deletemp3', mp3);
    }
  }
}
