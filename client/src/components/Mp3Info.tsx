import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Mp3 } from '../type';
import { upperFirstLetter } from '../tools';
import Config from '../Config';

type Mp3InfoProps = {
  mp3: Mp3;
  onSearch: (s: string, type: string) => Promise<null>;
  compact?: boolean;
  smallText?: boolean;
};

const titleStyle = {
  flex: 1,
  color: 'white',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  alignItems: 'flex-start',
  display: 'flex',
};

const styleSub = {
  ...titleStyle,
  color: 'rgb(243, 244, 246)',
  fontSize: Config.fontSizes.small,
};

const flexStart95 = { width: '95%', alignItems: 'flex-start', display: 'flex' };

export default function Mp3Info({ mp3, compact = false, smallText = false, onSearch }: Mp3InfoProps) {
  const title = upperFirstLetter(mp3?.title);
  const album = upperFirstLetter(mp3?.album);
  const artist = upperFirstLetter(mp3?.artist);
  const genre = upperFirstLetter(mp3?.genre);

  if (compact) {
    return (
      <Grid id="compact" container direction="row" justifyContent="space-between" alignItems="center">
        <Grid id="boxtitlec" item xs={7} sx={flexStart95}>
          {renderTitle()}
        </Grid>
        <Grid id="boxartistc" item xs={5} sx={flexStart95}>
          {renderArtist()}
        </Grid>
        <Grid id="boxalbumc" item xs={7} sx={flexStart95}>
          {renderAlbum()}
        </Grid>
        <Grid id="boxgenrec" item xs={5} sx={flexStart95}>
          {renderGenre()}
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Box
        id="notcompact"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }}
      >
        <Box id="boxTitle" sx={flexStart95}>
          {renderTitle()}
        </Box>
        <Box id="boxalbum" sx={flexStart95}>
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
      </Box>
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
        sx={titleStyle}
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
      <ButtonBase onClick={() => onSearch(s, type)}>
        <Typography variant="body2" sx={styleSub}>
          {italic ? <i>{s}</i> : s}
        </Typography>
      </ButtonBase>
    );
  }
}
