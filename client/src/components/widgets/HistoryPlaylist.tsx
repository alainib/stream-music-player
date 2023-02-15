import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Button, Modal } from '@mui/material';

import Config from '../../Config';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';

import { Mp3 } from '../../type';

const classes = {
  container: {
    position: 'absolute' as 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '98vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '15px',
  },
};

const Label = styled('span')(({ theme }) => ({}));

type HistoryPlaylistProps = {
  history: [{ list: []; label: string }];
  changePlaylist: (newlist: Mp3[], index: number, label: string, addToHistory: boolean) => null;
};

export function HistoryPlaylist({ history, changePlaylist }: HistoryPlaylistProps) {
  const [index, setIndex] = useState<number>(history?.length ? history.length - 1 : 0);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (history?.[index]) {
      changePlaylist(history[index].list, 0, history[index].label, false);
    }
  }, [index]);

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <HistoryIcon fontSize="large" htmlColor={Config.colors.lightgray} />
      </IconButton>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="history modal"
        aria-describedby="modal-history"
        sx={{ backgroundColor: 'rgba(28, 27, 23, 0.56)' }}
      >
        <Box sx={classes.container}>
          <Box style={classes.spaceBetween}>
            Historique de lecture :
            <IconButton aria-label="close" onClick={handleClose} sx={{ zIndex: 1 }}>
              <CloseIcon fontSize="medium" htmlColor={Config.colors.lightgray} />
            </IconButton>
          </Box>
          {history.map((elem, index) => (
            <Box key={elem?.label}>
              <Button
                onClick={() => {
                  handleClose();
                  setIndex(index);
                }}
              >
                {elem?.label}
              </Button>
            </Box>
          ))}
        </Box>
      </Modal>
    </Box>
  );
}

export function addListToHistory(list: Mp3[], label: string, history: []) {
  if (list?.length < 1) {
    return history;
  }

  if (history.length == 0) {
    return [{ label, list }];
  } else {
    const stringifiedList = JSON.stringify({ label, list });
    let found = history?.filter((l) => JSON.stringify(l) === stringifiedList);

    if (found?.length > 0) {
      return history;
    }
  }
  return [...history, { label, list }];
}
