import React, { useState, useEffect } from 'react';

import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';

import ShuffleIcon from '@mui/icons-material/Shuffle';

import LoadingGif from './LoadingGif';
import { PlayListWithModal, PlayList } from './PlayList';
import TitleGender from './TitleGender';
import Image from './Image';
import useMediaQueries from '../hooks/useMediaQueries';
import { runQuery } from '../services/music';
import Config from '../Config';
import { Mp3 } from '../type';
import { upperFirstLetter } from '../tools';

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  minHeight: 'min(400px,92vw)',
  width: '94%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  /*backgroundColor: 'rgba(69,70,72,0.9)',*/
  backdropFilter: 'blur(40px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    width: 'min(400px,92vw)',
  },
}));

const CoverImage = styled('div')({
  height: 'min(400px,92vw)',
  width: 'min(400px,92vw)',
  objectFit: 'cover',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  borderRadius: 16,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
    height: '100%',
  },
});

export function MusicPlayer() {
  const theme = useTheme();
  const { isMobile } = useMediaQueries();

  const [loading, setLoading] = useState<boolean>(true);
  // current track being played
  const [currentTrack, setCurrentTrack] = useState<Mp3>({ id: '', title: '', img: '', path: '', album: '', genre: '' });
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  // list of all tracks
  const [list, setList] = useState<Mp3[]>([]);
  // list of aggs
  const [aggs, setAggs] = useState(null);

  useEffect(() => {
    initRandomMusic();
  }, []);

  useEffect(() => {
    if (list?.[currentTrackIndex]) {
      setCurrentTrack(list[currentTrackIndex]);
    }
  }, [currentTrackIndex]);

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  if (isMobile) {
    return (
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <PlayListWithModal currentTrack={currentTrack} list={list} onChange={handlePlayListChange} loadMore={handleLoadMore} />
        {renderCurrentPlayer()}
      </Box>
    );
  } else {
    return (
      <Box id="desktop" sx={{ width: '100%', display: 'flex', flex: 1, flexDirection: 'row' }}>
        <div>{renderCurrentPlayer()}</div>
        <Box sx={{ paddingLeft:"15px" , width: 'min(85%,1200px)' }}>
          <PlayList currentTrack={currentTrack} list={list} onChange={handlePlayListChange} loadMore={handleLoadMore} />
        </Box>
      </Box>
    );
  }

  function renderCurrentPlayer() {
    return (
      <Widget id="Widget">
        {loading ? (
          <LoadingGif />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
            <CoverImage>
              <Image src={Config.static_path + currentTrack?.img} />
            </CoverImage>
            {renderPlayer()}
            <Box sx={{ mt: 1.5, minWidth: 0, width: '100%', height: '70px' }}>
              <TitleGender mp3={currentTrack} twoRows={true} />
            </Box>
          </Box>
        )}
      </Widget>
    );
  }

  function handlePlayListChange(index: number) {
    if (index !== currentTrackIndex) {
      setCurrentTrack(list[index]);
    }
    return null;
  }

  async function search(s: string) {
    setLoading(true);
    const resDatas = await runQuery({ typeOfQuery: 'post', url: '/api/search' });
    setAggs(resDatas?.aggregations);
    setList(
      resDatas?.hits?.hits.map((elem: any) => ({
        id: elem.id,
        ...elem?._source,
      }))
    );
    setLoading(false);
  }

  async function initRandomMusic() {
    setLoading(true);
    const res = await runQuery({ typeOfQuery: 'get', url: '/api/getrandommusic' });
    setList(res);
    setCurrentTrack(res[0]);
    setCurrentTrackIndex(0);
    setLoading(false);
  }

  async function getNextRandomMusic(setCTI: boolean = false) {
    const res = await runQuery({ typeOfQuery: 'get', url: '/api/getrandommusic' });
    setList((list) => [...list, ...res]);
    if (setCTI) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  }

  function handleLoadMore() {
    getNextRandomMusic(false);
    return null;
  }

  function handleOnEnd() {
    handleNext();
  }

  function handlePrevious() {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((oldIndex) => oldIndex - 1);
    }
  }

  function handleNext() {
    if (currentTrackIndex + 1 < list.length) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      getNextRandomMusic(true);
    }
  }
  function handleShuffle() {
    getNextRandomMusic(true);
  }

  function renderAudio() {
    // autoPlay
    return currentTrack?.path !== '' ? (
      <audio onEnded={handleOnEnd} autoPlay controls src={Config.static_path + currentTrack.path} />
    ) : (
      <>Audio file not available, try next ?</>
    );
  }

  function renderPlayer() {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          m: '15px 0px',
          backgroundColor: 'white',
          borderRadius: '20px',
          width: '100%',
        }}
      >
        {isMobile ? (
          <>
            <Grid container direction="row" justifyContent="space-around" alignItems="center">
              <Grid item xs={12}>
                {renderAudio()}
              </Grid>
              <Grid item xs={4}>
                <IconButton aria-label="previous song" onClick={() => handlePrevious()}>
                  <FastRewindRounded fontSize="medium" htmlColor={mainIconColor} />
                </IconButton>
              </Grid>

              <Grid item xs={4}>
                <IconButton aria-label="next song" onClick={() => handleShuffle()}>
                  <ShuffleIcon fontSize="medium" htmlColor={mainIconColor} />
                </IconButton>
              </Grid>
              <Grid item xs={4}>
                <IconButton aria-label="next song" onClick={() => handleNext()}>
                  <FastForwardRounded fontSize="medium" htmlColor={mainIconColor} />
                </IconButton>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <IconButton aria-label="previous song" onClick={() => handlePrevious()}>
              <FastRewindRounded fontSize="medium" htmlColor={mainIconColor} />
            </IconButton>
            {renderAudio()}
            <IconButton aria-label="next song" onClick={() => handleNext()}>
              <FastForwardRounded fontSize="medium" htmlColor={mainIconColor} />
            </IconButton>
          </>
        )}
      </Box>
    );
  }
}
