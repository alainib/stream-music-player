import React, { useState, useEffect } from 'react';

import { styled, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';

import LoadingGif from './LoadingGif';
import Image from './Image';
import useMediaQueries from '../hooks/useMediaQueries';
import { runQuery } from '../services/music';
import Config from '../Config';

type Mp3 = { _id: string; title: string; img: string; path: string; album: string; genre: string };

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  minHeight: 200,
  width: 'min(400px,90%)',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CoverImage = styled('div')({
  height: '400px',
  width: '100%',
  objectFit: 'cover',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  borderRadius: 24,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
    height: '100%',
  },
});

export function MusicPlayerSlider() {
  const theme = useTheme();
  const { isMobile } = useMediaQueries();

  const [loading, setLoading] = useState<boolean>(true);
  // current track being played
  const [currentTrack, setCurrentTrack] = useState<Mp3>({ _id: '', title: '', img: '', path: '', album: '', genre: '' });
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  // list of all tracks
  const [audioList, setAudioList] = useState<Mp3[]>([]);
  // list of aggs
  const [aggs, setAggs] = useState(null);

  useEffect(() => {
    initRandomMusic();
  }, []);

  useEffect(() => {
    if (audioList?.[currentTrackIndex]) {
      setCurrentTrack(audioList[currentTrackIndex]);
    }
  }, [currentTrackIndex]);

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Widget>
        {loading ? (
          <LoadingGif />
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
              <CoverImage>
                <Image src={Config.static_path + currentTrack?.img} />
              </CoverImage>
              {renderPlayer()}
              <Box sx={{ m: 1.5, minWidth: 0, width: '100%' }}>
                <Tooltip
                  title={
                    <div>
                      {cleanString(currentTrack?.title)} <br />
                      {`${cleanString(currentTrack?.album)} (${cleanString(currentTrack?.genre)})`}
                    </div>
                  }
                >
                  <Typography
                    variant="h4"
                    color="text.secondary"
                    fontWeight={500}
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {cleanString(currentTrack?.title)}
                  </Typography>
                </Tooltip>
                <Typography variant="h5" noWrap>
                  {cleanString(currentTrack?.album)}
                </Typography>
                <Typography variant="h6" noWrap>
                  {cleanString(currentTrack?.genre)}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Widget>
    </Box>
  );

  async function search(s: string) {
    setLoading(true);
    const resDatas = await runQuery({ typeOfQuery: 'post', url: '/api/search' });
    setAggs(resDatas?.aggregations);
    setAudioList(
      resDatas?.hits?.hits.map((elem: any) => ({
        id: elem._id,
        ...elem?._source,
      }))
    );
    setLoading(false);
  }

  async function initRandomMusic() {
    setLoading(true);
    const res = await runQuery({ typeOfQuery: 'get', url: '/api/getrandommusic' });
    setAudioList(res);
    setCurrentTrack(res[0]);
    setCurrentTrackIndex(0);
    setLoading(false);
  }

  async function getNextRandomMusic() {
    const res = await runQuery({ typeOfQuery: 'get', url: '/api/getrandommusic' });
    setAudioList((list) => [...list, ...res]);
    setCurrentTrackIndex(currentTrackIndex + 1);
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
    if (currentTrackIndex + 1 < audioList.length) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      getNextRandomMusic();
    }
  }

  function renderAudio() {
    // autoPlay
    return currentTrack?.path !== '' ? (
      <audio onEnded={handleOnEnd} controls src={Config.static_path + currentTrack.path} />
    ) : (
      <>Audio not available, try next ?</>
    );
  }

  function renderPlayer() {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          m: '5px',
          backgroundColor: 'white',
          borderRadius: isMobile ? '20px' : '50px',
          p: '3px',
        }}
      >
        {isMobile ? (
          <div>
            {renderAudio()}
            <Grid container direction="row" justifyContent="space-around" alignItems="center">
              <Grid item xs={5}>
                <IconButton aria-label="previous song" onClick={() => handlePrevious()}>
                  <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
                </IconButton>
              </Grid>
              <Grid item xs={5}>
                <IconButton aria-label="next song" onClick={() => handleNext()}>
                  <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
                </IconButton>
              </Grid>
            </Grid>
          </div>
        ) : (
          <>
            <IconButton aria-label="previous song" onClick={() => handlePrevious()}>
              <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
            </IconButton>
            {renderAudio()}
            <IconButton aria-label="next song" onClick={() => handleNext()}>
              <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
            </IconButton>
          </>
        )}
      </Box>
    );
  }
  function cleanString(str: string) {
    if (!!str) {
      return str;
    } else return '';
  }
}
