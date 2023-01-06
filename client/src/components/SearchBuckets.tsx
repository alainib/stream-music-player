import { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
/*import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';*/

import { Grid, Box, IconButton } from '@mui/material';

import { Mp3, BucketType, newBuckets } from '../type';
import { runQuery } from '../services/music';
import Bucket from './Bucket';
import useMediaQueries from '../hooks/useMediaQueries';
import { useModalSearchBucketsContext } from '../hooks/SearchBucketsContext';
import Config from '../Config';

const SearchBucketsFixedContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '15px',
  right: '15px',
  zIndex: 2,
  backgroundColor: 'rgba(69,70,72,0.7)',
  backdropFilter: 'blur(40px)',
  borderRadius: 16,
  padding: 10,
  // width: 'min(380px,92vw)',
}));

type SearchBucketsProps = {
  onChange: (arg: number) => null;
};

type SearchBucketsWithModalProps = Omit<SearchBucketsProps, 'onClose'> & { onClose?: () => null };

export function SearchBucketsWithModal(props: SearchBucketsWithModalProps) {
  const { showModalSearchBuckets, setModalShowSearchBuckets } = useModalSearchBucketsContext();

  return (
    <>
      {showModalSearchBuckets && (
        <SearchBucketsFixedContainer id="SearchBucketsWithModalComponent">
          <Grid container direction="column" justifyContent="flex-start" alignItems="flex-end">
            <Grid item xs>
              <IconButton aria-label="next song" onClick={() => setModalShowSearchBuckets(false)}>
                <CloseIcon id="CloseIcon" fontSize="large" htmlColor={Config.iconColor} />
              </IconButton>
            </Grid>
            <Grid item xs>
              <SearchBuckets {...props} />
            </Grid>
          </Grid>
        </SearchBucketsFixedContainer>
      )}
    </>
  );
}

const mobileStyle = { maxWidth: 360 };
const desktopStyle = {
  width: '100%',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  zIndex: 1,
};

export function SearchBuckets({ onChange }: SearchBucketsProps) {
  const { isMobile } = useMediaQueries();

  const [loading, setLoading] = useState<boolean>(false);
  // list of Buckets
  const [buckets, setBuckets] = useState(newBuckets());
  /* 
  depth of browsing, 
  0 : show all genre
  1 : show all artist of a genre
  2 : show all album of an artist
  3 : show all mp3 of an album
  4 : show search 
  */
  const [depth, setDepth] = useState<number>(0);

  useEffect(() => {
    searchBuckets();
  }, []);

  async function searchBuckets(search?: string, field?: string) {
    if (!loading) {
      console.log({ search, field });
      setLoading(true);
      const resDatas = await runQuery({ typeOfQuery: 'post', url: '/api/getaggs', search, field });

      console.log(resDatas);

      setBuckets(resDatas);

      setLoading(false);
    }
    return null;
  }

  return (
    <Box sx={isMobile ? mobileStyle : desktopStyle} id="SearchBucketsComponent">
      {(depth === 0 || depth === 4) && <Bucket data={buckets?.genre} label={'genre'} onSelect={(label: string) => handleDepth(1, label)} />}
      {(depth === 1 || depth === 4) && <Bucket data={buckets?.album} label={'album'} onSelect={(label: string) => handleDepth(2, label)} />}
      {(depth === 2 || depth === 4) && (
        <Bucket data={buckets?.artist} label={'artist'} onSelect={(label: string) => handleDepth(3, label)} />
      )}
    </Box>
  );

  function handleDepth(depth: number, label: string) {
    console.log('depth', { depth, label });
  }
}
