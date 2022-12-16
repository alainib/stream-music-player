import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CloseIcon from '@mui/icons-material/Close';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { Mp3 } from '../type';
import { getFolderImagePath, scrollToAnchor } from '../tools';
import Mp3Info from './Mp3Info';
import useMediaQueries from '../hooks/useMediaQueries';

const iconColor = '#C8CBCD';
const dividerColor = '#838387';

const FloatingContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '15px',
  right: '15px',
  zIndex: 2,
}));

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

type PlayListWithModalProps = {
  list: Mp3[];
  currentTrack: Mp3;
  onChange: (arg: number) => null;
  loadMore: () => null;
  onClose?: () => null;
};

type PlayListProps = {
  list: Mp3[];
  currentTrack: Mp3;
  onChange: (arg: number) => null;
  loadMore: () => null;
};

export function PlayListWithModal(props: PlayListWithModalProps) {
  const [showPlayList, setShowPlayList] = useState<boolean>(false);

  function toggleShowPlayList() {
    setShowPlayList(!showPlayList);
    return null;
  }

  return (
    <>
      <FloatingContainer>
        <IconButton aria-label="next song" onClick={toggleShowPlayList}>
          <QueueMusicIcon id="MenuIcon" fontSize="large" htmlColor={iconColor} />
        </IconButton>
      </FloatingContainer>
      {showPlayList && (
        <PlaylistFixedContainer>
          <Grid container direction="column" justifyContent="flex-start" alignItems="flex-end">
            <Grid item xs>
              <IconButton aria-label="next song" onClick={toggleShowPlayList}>
                <CloseIcon id="CloseIcon" fontSize="large" htmlColor={iconColor} />
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

export function PlayList({ list, currentTrack, onChange, loadMore }: PlayListProps) {
  const { isMobile } = useMediaQueries();
  const style = isMobile
    ? { maxWidth: 360 }
    : {
        zIndex: 1,
      };

  return (
    <>
      <List
        id="PlayList"
        sx={{
          width: '100%',
          //  bgcolor: 'background.paper',
          overflow: 'auto',
          position: 'relative',
          maxHeight: '80vh',
          marginBottom: '12px',
          ...style,
        }}
      >
        {list.map((mp3: Mp3, index: number) => {
          return (
            <>
              <ListItemButton
                alignItems="flex-start"
                key={mp3.id + index}
                id={mp3.id}
                selected={currentTrack?.id === mp3.id}
                onClick={() => onChange(index)}
                sx={{ alignItems: 'center' }}
              >
                <ListItemAvatar>
                  <Avatar alt={mp3?.title} src={getFolderImagePath(mp3?.img, true)} />
                </ListItemAvatar>
                <ListItemText primary={<Mp3Info mp3={mp3} smallText={true} twoRows={isMobile} />} />
              </ListItemButton>
              <Divider color={dividerColor} key={mp3.id + 'divider' + index} />
            </>
          );
        })}
      </List>
      <IconButton
        aria-label="next song"
        onClick={() => {
          loadMore();
          scrollToAnchor(list[list.length - 1].id);
        }}
        id="loadMore"
        sx={{ zIndex: 1 }}
      >
        <PlaylistAddIcon fontSize="large" htmlColor={iconColor} />
      </IconButton>
    </>
  );
}
