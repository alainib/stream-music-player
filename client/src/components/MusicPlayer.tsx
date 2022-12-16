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
import useLocalStorage from '../hooks/useLocalStorage';
import { runQuery } from '../services/music';
import Config from '../Config';
import { Mp3 } from '../type';

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  minHeight: 'min(400px,92vw)',
  width: 'min(400px,92vw)',
  margin: '10px',
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'rgba(250,250,250,0.1)',
  //backdropFilter: 'blur(140px)',
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

  const [loading, setLoading] = useState<boolean>(false);
  // current track being played
  //const [currentTrack, setCurrentTrack] = useState<Mp3>({ id: '', title: '', img: '', path: '', album: '', genre: '' });
  const [currentTrack, setCurrentTrack] = useLocalStorage('currentTrack', { id: '', title: '', img: '', path: '', album: '', genre: '' });

  //const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useLocalStorage('currentTrackIndex', -1);

  // list of all tracks
  // const [list, setList] = useState<Mp3[]>([]);
  const [list, setList] = useLocalStorage('mp3list', []);

  // list of aggs
  const [aggs, setAggs] = useState(null);

  useEffect(() => {
    if (list?.length < 1) {
      initRandomMusic();
    }
  }, []);

  useEffect(() => {
    if (list?.[currentTrackIndex]) {
      setCurrentTrack(list[currentTrackIndex]);
    }
  }, [currentTrackIndex]);

  // to fix side effect of list taking time to get saved in state, so when handleTrackChange is called list still empty
  useEffect(() => {
    if (list?.length > 0 && currentTrackIndex == -1) {
      handleTrackChange(0);
    }
  }, [list]);

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  if (isMobile) {
    return (
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <PlayListWithModal currentTrack={currentTrack} list={list} onChange={handleTrackChange} loadMore={handleLoadMore} />
        {renderCurrentPlayer()}
      </Box>
    );
  } else {
    return (
      <Box id="desktop" sx={{ width: '100%', display: 'flex', flex: 1, flexDirection: 'row' }}>
        <div>{renderCurrentPlayer()}</div>
        <Box sx={{ paddingLeft: '15px', width: 'min(85%,1200px)' }}>
          <PlayList currentTrack={currentTrack} list={list} onChange={handleTrackChange} loadMore={handleLoadMore} />
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
              <Image src={currentTrack?.img} />
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

  function handleTrackChange(index: number) {
    if (index !== currentTrackIndex && list?.[index]) {
      // don't do this setCurrentTrack(list[index]); useEffect do it to avoid side effect
      setCurrentTrackIndex(index);
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
    console.log(res);
    setList(res);
    handleTrackChange(0);
    setLoading(false);
  }

  /**
   * load new music
   * @param setCTI  : if true set current track index
   */
  async function getNextRandomMusic(setCTI: boolean = false, replaceList: boolean = false) {
    const res = await runQuery({ typeOfQuery: 'get', url: '/api/getrandommusic' });
    if (replaceList) {
      setList(res);
      handleTrackChange(0);
    } else {
      setList((list: Mp3[]) => [...list, ...res]);
      if (setCTI) {
        handleTrackChange(currentTrackIndex + 1);
      }
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
      handleTrackChange(currentTrackIndex - 1);
    }
  }

  function handleNext() {
    if (currentTrackIndex + 1 < list.length) {
      handleTrackChange(currentTrackIndex + 1);
    } else {
      getNextRandomMusic(true);
    }
  }
  function handleShuffle() {
    getNextRandomMusic(true, true);
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
        {true || isMobile ? (
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
