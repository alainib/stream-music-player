import { useState, useEffect, useMemo } from 'react';

import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';

import ShuffleIcon from '@mui/icons-material/Shuffle';
import LoadingGif from './widgets/LoadingGif';
import { PlayListWithModal, PlayList } from './PlayList';
import { SearchBucketsWithModal, SearchBuckets } from './SearchBuckets';
import Mp3Info from './Mp3Info';
import Image from './widgets/Image';
import AudioPlayer from './AudioPlayer';
import useMediaQueries from '../hooks/useMediaQueries';
import useLocalStorage from '../hooks/useLocalStorage';
import { useModalPlaylistContext } from '../context/PlaylistContext';
import { runQuery } from '../services/music';
import Config from '../Config';
import { Mp3, newMp3 } from '../type';

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  paddingTop: 0,
  borderRadius: 16,
  minHeight: 'min(680px,92vw)',
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
  const [currentTrack, setCurrentTrack] = useLocalStorage('currentTrack', newMp3());
  const [currentTrackIndex, setCurrentTrackIndex] = useLocalStorage('currentTrackIndex', -1);
  // list of all tracks being played curently
  const [list, setList] = useLocalStorage('mp3list', []);
  const [history, setHistory] = useLocalStorage('history', []);

  const { showModalPlaylist, setModalShowPlaylist } = useModalPlaylistContext();
  const [showPlaylist, setShowPlaylist] = useLocalStorage('showPlaylist', true);
  const [showSearchBuckets, setShowSearchBuckets] = useLocalStorage('showSearchBuckets', false);

  useEffect(() => {
    if (list?.length < 1) {
      initRandomMusic();
    }
  }, []);

  useEffect(() => {
    if (list?.[currentTrackIndex]) {
      setCurrentTrack(list[currentTrackIndex]);
    }
  }, [list, currentTrackIndex]);

  // to fix side effect of list taking time to get saved in state, so when handleTrackChange is called list still empty
  useEffect(() => {
    if (list?.length > 0 && currentTrackIndex == -1) {
      handleTrackChange(0);
    }
  }, [list]);

  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  const memoizedPlayerRender = useMemo(() => renderCurrentPlayer(), [list, currentTrackIndex, currentTrack]);

  if (isMobile) {
    return (
      <Box id="MusicPlayerComponentMobile" sx={{ width: '100%', overflow: 'hidden' }}>
        <PlayListWithModal
          currentTrack={currentTrack}
          list={list}
          onTrackChange={handleTrackChange}
          loadMore={handleLoadMore}
          onSearch={onSearch}
        />
        <SearchBucketsWithModal changePlaylist={handleListChange} />
        {memoizedPlayerRender}
      </Box>
    );
  } else {
    return (
      <Box id="MusicPlayerComponentDesktop" sx={{ width: '100%', display: 'flex', flex: 1, flexDirection: 'row' }}>
        <div>{memoizedPlayerRender}</div>

        <Box sx={{ paddingLeft: '15px', width: 'min(85%,1200px)' }}>
          {showPlaylist && !showSearchBuckets && (
            <PlayList
              currentTrack={currentTrack}
              list={list}
              onTrackChange={handleTrackChange}
              loadMore={handleLoadMore}
              onSearch={onSearch}
            />
          )}
          {showSearchBuckets && !showPlaylist && <SearchBuckets changePlaylist={handleListChange} />}
        </Box>
      </Box>
    );
  }

  function renderCurrentPlayer() {
    return (
      <Widget id="Widget">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <IconButton aria-label="next song" onClick={handleShowSearchBuckets} id="loadMore" sx={{ zIndex: 1 }}>
                <ManageSearchIcon fontSize="large" htmlColor={Config.iconColor} />
              </IconButton>
            </Grid>

            <Grid item>
              <IconButton aria-label="next song" onClick={handleShowPlaylist} id="loadMore" sx={{ zIndex: 1 }}>
                <QueueMusicIcon fontSize="large" htmlColor={Config.iconColor} />
              </IconButton>
            </Grid>
          </Grid>
          <CoverImage>
            <Image src={currentTrack?.path} size="large" />
          </CoverImage>
          {loading ? <LoadingGif /> : renderPlayer()}
          <Box sx={{ mt: 1.5, minWidth: 0, width: '100%', height: '70px' }}>
            <Mp3Info mp3={currentTrack} compact={false} onSearch={onSearch} />
          </Box>
        </Box>
      </Widget>
    );
  }

  function handleShowSearchBuckets() {
    if (isMobile) {
      setModalShowPlaylist(false);
    } else {
      setShowPlaylist(false);
      setShowSearchBuckets(true);
    }
  }

  function handleShowPlaylist() {
    if (isMobile) {
      setModalShowPlaylist(true);
    } else {
      setShowPlaylist(true);
      setShowSearchBuckets(false);
    }
  }

  /*
  const { showModalPlaylist, setModalShowPlaylist } =  
  const [showPlaylist, ] =  
  const [showSearchBuckets, ] 
  */

  function handleTrackChange(index: number) {
    if (index !== currentTrackIndex && list?.[index]) {
      // don't do this setCurrentTrack(list[index]); useEffect do it to avoid side effect
      setCurrentTrackIndex(index);
    }
    return null;
  }

  async function onSearch(search: string, field: string) {
    console.log({ search, field });
    setLoading(true);
    const resDatas = await runQuery({ typeOfQuery: 'post', url: '/api/getmusicof', filters: { [field]: [search] } });
    console.log(resDatas);

    //setList(resDatas?.hits?.hits.map((elem: any) => ({ id: elem.id, ...elem?._source })));
    setHistory(list);
    setList(resDatas);
    setLoading(false);

    return null;
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

  // change the playlist when mp3 are choosed from facets search
  function handleListChange(nlist: Mp3[], index: number) {   
    setHistory(list);
    setList(nlist);
    handleTrackChange(index);
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
    return <AudioPlayer src={currentTrack?.path} handleOnEnd={handleOnEnd} />;
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
