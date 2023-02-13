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
import BackgroundImage from './widgets/BackgroundImage';
import { HistoryPlaylist, addListToHistory } from './widgets/HistoryPlaylist';
import AudioPlayer from './AudioPlayer';
import useMediaQueries from '../hooks/useMediaQueries';
import useLocalStorage from '../hooks/useLocalStorage';
import { useModalPlaylistContext } from '../context/PlaylistContext';
import { runQuery } from '../services/music';
import Config from '../Config';
import { Mp3, newMp3 } from '../type';
import { shuffleArray } from '../tools';

 

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  paddingTop: 0,
  borderRadius: 16,
  minHeight: 'min(680px,92vw)',
  width: Config.imageSize,
  margin: '10px',
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'rgba(250,250,250,0.1)',
  //backdropFilter: 'blur(140px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    width: Config.imageSize,
  },
}));

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
                <ManageSearchIcon fontSize="large" htmlColor={Config.colors.lightgray} />
              </IconButton>
            </Grid>
            <HistoryPlaylist history={history} changePlaylist={handleListChange} />

            <Grid item>
              <IconButton aria-label="next song" onClick={handleShowPlaylist} id="loadMore" sx={{ zIndex: 1 }}>
                <QueueMusicIcon fontSize="large" htmlColor={Config.colors.lightgray} />
              </IconButton>
            </Grid>
          </Grid>
          <BackgroundImage url={currentTrack?.path} />
          {loading ? <LoadingGif /> : renderPlayer()}
          <Box sx={{ mt: 1.5, minWidth: 0, width: '100%', minHeight: '90px' }}>
            <Mp3Info mp3={currentTrack} compact={true} onSearch={onSearch} />
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

    setListToHistory(list, history);
    _setList(resDatas);
    setLoading(false);

    return null;
  }

  async function initRandomMusic() {
    setLoading(true);
    const res = await runQuery({ typeOfQuery: 'get', url: '/api/getrandommusic' });
    console.log(res);
    _setList(res);
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
      _setList(res);
      handleTrackChange(0);
    } else {
      _setList([...list, ...res]);
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
  function handleListChange(newlist: Mp3[], index: number, addToHistory: boolean = true) {
    if (addToHistory) {
      setListToHistory(list, history);
    }
    _setList(newlist);
    handleTrackChange(index);
    handleShowPlaylist();
    return null;
  }

  function _setList(a: Mp3[]) {
    setList(a || []);
  }

  function handleOnEndOfTrack() {
    handleNextTrack();
  }

  function isFirstTrack() {
    return currentTrackIndex === 0;
  }
  function handlePreviousTrack() {
    if (!isFirstTrack()) {
      handleTrackChange(currentTrackIndex - 1);
    }
  }

  function isLastTrack() {
    return currentTrackIndex + 1 === list?.length;
  }
  function handleNextTrack() {
    if (!isLastTrack()) {
      handleTrackChange(currentTrackIndex + 1);
    } else {
      getNextRandomMusic(true);
    }
  }

  function handleShuffleTrack() {
    //getNextRandomMusic(true, true);
    setList(shuffleArray(list));
  }

  function setListToHistory(list: Mp3[], history: []) {
    setHistory(addListToHistory(list, history));
  }

  function renderAudio() {
    return <AudioPlayer src={currentTrack?.path} handleOnEndOfTrack={handleOnEndOfTrack} />;
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
        <Grid container direction="row" justifyContent="space-around" alignItems="center">
          <Grid item xs={12}>
            {renderAudio()}
          </Grid>
          <Grid item xs={4}>
            {renderPreviousTrackButton()}
          </Grid>

          <Grid item xs={4}>
            <IconButton aria-label="next song" onClick={() => handleShuffleTrack()}>
              <ShuffleIcon fontSize="medium" htmlColor={Config.colors.black} />
            </IconButton>
          </Grid>
          <Grid item xs={4}>
            {renderNextTrackButton()}
          </Grid>
        </Grid>
      </Box>
    );
    /*isMobile ? (
          <>
            <Grid container direction="row" justifyContent="space-around" alignItems="center">
              <Grid item xs={12}>
                {renderAudio()}
              </Grid>
              <Grid item xs={4}>
                {renderPreviousTrackButton()}
              </Grid>

              <Grid item xs={4}>
                <IconButton aria-label="next song" onClick={() => handleShuffleTrack()}>
                  <ShuffleIcon fontSize="medium" htmlColor={Config.colors.lightgray} />
                </IconButton>
              </Grid>
              <Grid item xs={4}>
                {renderNextTrackButton()}
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            {renderPreviousTrackButton()}
            {renderAudio()}
            {renderNextTrackButton()}
          </>
        )*/
  }
  function renderPreviousTrackButton() {
    const isFirst = isFirstTrack();
    return (
      <IconButton aria-label="previous song" disabled={isFirst} onClick={handlePreviousTrack}>
        <FastRewindRounded fontSize="medium" htmlColor={isFirst ? Config.colors.mediumgray : Config.colors.black} />
      </IconButton>
    );
  }

  function renderNextTrackButton() {
    const isLast = isLastTrack();
    return (
      <IconButton aria-label="next song" disabled={isLast} onClick={handleNextTrack}>
        <FastForwardRounded fontSize="medium" htmlColor={isLast ? Config.colors.mediumgray : Config.colors.black} />
      </IconButton>
    );
  }
}

