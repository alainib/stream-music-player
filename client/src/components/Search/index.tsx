import { useState } from 'react';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

import { Grid, Box, IconButton } from '@mui/material';

import { ChangePlaylistProps } from '../../type';

// import SizeSlider from './widgets/SizeSlider';
import SearchInput from './SearchInput';
import BrowseBuckets from './BrowseBuckets';
import useMediaQueries from '../../hooks/useMediaQueries';
import { useModalSearchContext } from '../../context/SearchContext';

import Config from '../../Config';

const SearchFixedContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '15px',
  right: '15px',
  zIndex: 2,
  backgroundColor: 'rgba(69,70,72,0.7)',
  backdropFilter: 'blur(40px)',
  borderRadius: '20px',
  padding: 10,
  // width: 'min(380px,92vw)',
}));

type SearchWithModalProps = Omit<ChangePlaylistProps, 'onClose'> & { onClose?: () => null };

export function SearchWithModal(props: SearchWithModalProps) {
  const { showModalSearch, setModalShowSearch } = useModalSearchContext();

  return (
    <>
      {showModalSearch && (
        <SearchFixedContainer id="SearchWithModalComponent">
          <Grid container direction="column" justifyContent="flex-start" alignItems="flex-end">
            <Grid item xs>
              <IconButton aria-label="next song" onClick={() => setModalShowSearch(false)}>
                <CloseIcon id="CloseIcon" fontSize="large" htmlColor={Config.colors.lightgray} />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Search {...props} />
            </Grid>
          </Grid>
        </SearchFixedContainer>
      )}
    </>
  );
}

const mobileStyle = { maxWidth: 360 };
const desktopStyle = {
  width: '100%',
  height: '90vh',
  position: 'relative',
  zIndex: 1,
};

const classes = {};

export function Search({ changePlaylist }: ChangePlaylistProps) {
  const { isMobile } = useMediaQueries();

  // to store user input for search
  const [hide, setHide] = useState<boolean>(false);

  return (
    <Box sx={isMobile ? mobileStyle : desktopStyle} id="SearchComponent">
      <SearchInput hideOther={handleHideOther} changePlaylist={changePlaylist} />
      {!hide && <BrowseBuckets changePlaylist={changePlaylist} />}
    </Box>
  );

  function handleHideOther(val: boolean) {
    setHide(val);
    return null;
  }
}
