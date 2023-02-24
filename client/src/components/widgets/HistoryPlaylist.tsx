import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Button, Modal, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HistoryIcon from '@mui/icons-material/History';
import Config from '../../Config';
import { maxStringLength } from '../../tools';

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
  marginLeft10: {
    marginLeft: '10px',
  },
};

const Label = styled('span')(({ theme }) => ({}));

type HistoryPlaylistProps = {
  history: [{ list: []; label: string }];
  changePlaylist: (newlist: Mp3[], index: number, label: string, addToHistory: boolean) => null;
  removeListFromHistory: (index: number) => null;
};

export function HistoryPlaylist({ history, changePlaylist, removeListFromHistory }: HistoryPlaylistProps) {
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
          <List>
            {history.map((elem, index) => (
              <ListItem disablePadding key={elem?.label + index}>
                <ListItemButton>
                  <ListItemText
                    primary={maxStringLength(elem?.label, 70) + ' (' + elem?.list?.length + ')'}
                    onClick={() => {
                      handleClose();
                      setIndex(index);
                    }}
                  />
                  <ListItemIcon sx={classes.marginLeft10} onClick={() => removeListFromHistory(index)}>
                    <DeleteOutlineIcon />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </Box>
  );
  {
    /*history.map((elem, index) => (
            <Box key={elem?.label}>
              <Button
                onClick={() => {
                  handleClose();
                  setIndex(index);
                }}
              >
                {elem?.label + ' (' + elem?.list?.length + ')'}
              </Button>
            </Box>
              ))*/
  }
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
  return [...history.slice(0, 9), { label, list }];
}
