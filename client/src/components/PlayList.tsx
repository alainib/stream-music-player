import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CloseIcon from '@mui/icons-material/Close';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { Mp3 } from '../type';
import { pathToFolderImageFromPath, scrollToAnchor } from '../tools';
import Mp3Info from './Mp3Info';
import ListContainer from './ListContainer';
import useMediaQueries from '../hooks/useMediaQueries';
import { useModalPlaylistContext } from '../hooks/PlaylistContext';
import Config from '../Config';

const PlaylistFixedContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '15px',
  right: '15px',
  zIndex: 2,
  backgroundColor: 'rgba(69,70,72,0.7)',
  backdropFilter: 'blur(40px)',
  borderRadius: 16,
  padding: 10,
  // width: 'min(380px,92vw)',
}));

type PlayListProps = {
  list: Mp3[];
  currentTrack: Mp3;
  onSearch: (s: string, type: string) => Promise<null>;
  onChange: (arg: number) => null;
  loadMore: () => null;
};

type PlayListWithModalProps = Omit<PlayListProps, 'onClose'> & { onClose?: () => null };

export function PlayListWithModal(props: PlayListWithModalProps) {
  const { showModalPlaylist, setModalShowPlaylist } = useModalPlaylistContext();

  return (
    <>
      {showModalPlaylist && (
        <PlaylistFixedContainer id="PlaylistFixedContainer">
          <Grid container direction="column" justifyContent="flex-start" alignItems="flex-end">
            <Grid item xs>
              <IconButton aria-label="next song" onClick={() => setModalShowPlaylist(false)}>
                <CloseIcon id="CloseIcon" fontSize="large" htmlColor={Config.iconColor} />
              </IconButton>
            </Grid>
            <Grid item xs>
              <PlayList {...props} />
            </Grid>
          </Grid>
        </PlaylistFixedContainer>
      )}
    </>
  );
}

export function PlayList({ list, currentTrack, onChange, loadMore, onSearch }: PlayListProps) {
  const { isMobile } = useMediaQueries();
  const style = isMobile ? { maxWidth: 360 } : { zIndex: 1 };

  return (
    <>
      <ListContainer id="PlayList" style={style}>
        {list.map((mp3: Mp3, index: number) => {
          return (
            <>
              <ListItem
                alignItems="flex-start"
                key={mp3.id + index}
                id={mp3.id}
                selected={currentTrack?.id === mp3.id}
                sx={{ alignItems: 'center' }}
              >
                <ListItemAvatar>
                  <IconButton onClick={() => onChange(index)}>
                    <Avatar alt={mp3?.title} src={pathToFolderImageFromPath(mp3?.path, true)} />
                  </IconButton>
                </ListItemAvatar>
                <ListItemText primary={<Mp3Info mp3={mp3} smallText={true} compact={true} onSearch={onSearch} />} />
              </ListItem>
              <Divider color={Config.dividerColor} key={mp3.id + 'divider' + index} />
            </>
          );
        })}
      </ListContainer>
      <IconButton
        aria-label="next song"
        onClick={() => {
          loadMore();
          scrollToAnchor(list[list.length - 1].id);
        }}
        id="loadMore"
        sx={{ zIndex: 1 }}
      >
        <PlaylistAddIcon fontSize="large" htmlColor={Config.iconColor} />
      </IconButton>
    </>
  );
}
