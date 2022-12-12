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
import Avatar from '@mui/material/Avatar';
import { Mp3 } from '../type';
import Config from '../Config';
import { cleanString } from '../tools';
import TitleGender from './TitleGender';

const iconColor = '#85878c';

const FloatingContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '15px',
  right: '15px',
  zIndex: 2,
}));

const PlaylistContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '15px',
  right: '15px',
  zIndex: 2,
  backgroundColor: 'white',
  borderRadius: '15px',
  paddingBottom: '12px',
}));

type PlayListProps = {
  list: Mp3[];
  currentTrack: Mp3;
  onChange: (arg: number) => null;
  loadMore: () => null;
};

export default function PlayList({ list, currentTrack, onChange, loadMore }: PlayListProps) {
  const [showPlayList, setShowPlayList] = useState<boolean>(false);

  function toggleShowPlayList() {
    setShowPlayList(!showPlayList);
  }

  return (
    <>
      <FloatingContainer>
        <IconButton aria-label="next song" onClick={toggleShowPlayList}>
          <QueueMusicIcon id="MenuIcon" fontSize="large" htmlColor={iconColor} />
        </IconButton>
      </FloatingContainer>
      {showPlayList && (
        <PlaylistContainer>
          <Grid container direction="column" justifyContent="flex-start" alignItems="flex-end">
            <Grid item xs>
              <IconButton aria-label="next song" onClick={toggleShowPlayList}>
                <CloseIcon id="CloseIcon" fontSize="large" htmlColor={iconColor} />
              </IconButton>
            </Grid>
            <Grid item xs>
              <List
                id="relative"
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                  overflow: 'auto',
                  position: 'relative',
                  maxHeight: '80vh',
                  marginBottom: '12px',
                }}
              >
                {list.map((mp3: Mp3, index: number) => {
                  return (
                    <ListItemButton
                      alignItems="flex-start"
                      key={mp3.id}
                      selected={currentTrack?.id === mp3.id}
                      onClick={() => onChange(index)}
                      divider={true}
                    >
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={Config.static_path + mp3?.img} />
                      </ListItemAvatar>
                      <ListItemText primary={<TitleGender {...mp3} />} />
                    </ListItemButton>
                  );
                })}
              </List>
              <IconButton aria-label="next song" onClick={loadMore}>
                <PlaylistAddIcon fontSize="large" htmlColor={iconColor} />
              </IconButton>
            </Grid>
          </Grid>
        </PlaylistContainer>
      )}
    </>
  );
}
