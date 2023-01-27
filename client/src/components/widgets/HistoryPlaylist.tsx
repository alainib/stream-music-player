import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import Config from '../../Config';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { Mp3 } from '../../type';

const Label = styled('span')(({ theme }) => ({}));

type HistoryPlaylistProps = {
  history: [];
  changePlaylist: (newlist: Mp3[], index: number, addToHistory: boolean) => null;
};

export function HistoryPlaylist({ history, changePlaylist }: HistoryPlaylistProps) {
  const [index, setIndex] = useState<number>(history?.length ? history.length - 1 : 0);

  useEffect(() => {
    changePlaylist(history[index], 0, false);
  }, [index]);

  return (
    <Box>
      <IconButton disabled={isFirst()} aria-label="next song" onClick={handlePrevious} id="loadMore" sx={{ zIndex: 1 }}>
        <ArrowLeftIcon fontSize="large" htmlColor={isFirst() ? Config.colors.gray : Config.colors.lightgray} />
      </IconButton>

      <IconButton disabled={isLast()} aria-label="next song" onClick={handleNext} id="loadMore" sx={{ zIndex: 1 }}>
        <ArrowRightIcon fontSize="large" htmlColor={isLast() ? Config.colors.gray : Config.colors.lightgray} />
      </IconButton>
    </Box>
  );

  function isFirst() {
    return index === 0;
  }
  function handlePrevious() {
    if (!isFirst()) {
      setIndex(index - 1);
    }
  }

  function isLast() {
    return index + 1 === history?.length;
  }
  function handleNext() {
    if (!isLast()) {
      setIndex(index + 1);
    }
  }
}

export function addListToHistory(list: Mp3[], history: []) {
  console.log({list, history});

  if (list?.length < 1) {
    return history;
  }

  if (history.length == 0) {
    return [list];
  } else {

    const stringifiedList = JSON.stringify(list);
    let found = history?.filter((l) => JSON.stringify(l) === stringifiedList);
    console.log({found})
    if (found?.length > 0) {
      return history;
    }
  }
  return [...history, list];
}
