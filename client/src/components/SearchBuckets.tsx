import { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Box, Button, IconButton, Typography, Breadcrumbs } from '@mui/material';

import { Mp3, newBuckets } from '../type';
import { runQuery } from '../services/music';
import Bucket from './Bucket';
import { PlayListWithQuery } from './PlayList';
// import SizeSlider from './widgets/SizeSlider';
import useMediaQueries from '../hooks/useMediaQueries';
import useDebounce from '../hooks/useDebounce';
import { useModalSearchBucketsContext } from '../context/SearchBucketsContext';
import { upperFirstLetter ,clj} from '../tools';
import Config from '../Config';

const _windowRatioSize = window.innerWidth < 600 ? 100 : 125;
const _DEBOUNCETIMEOUT = 1000;

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
  changePlaylist: (list: Mp3[], index: number) => null;
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

const _ROOT = 'racine';
const _GENRES = 'genre';
const _ARTISTS = 'artist';
const _ALBUMS = 'album';
const _MP3 = 'mp3';

function newFilters() {
  return {
    genre: [],
    artist: [],
    album: [],
    mp3: [],
  };
}

type FiltersType = {
  genre: string[];
  artist: string[];
  album: string[];
  mp3: string[];
};

const classes = {
  breadcrumbLabel: {
    height: '25px',
    color: 'white',
    textTransform: 'none',
  },
};

export function SearchBuckets({ changePlaylist }: SearchBucketsProps) {
  const { isMobile } = useMediaQueries();

  const [loading, setLoading] = useState<boolean>(false);
  // size of vignets
  const [vignetsSize, setVignetsSize] = useState<number>(_windowRatioSize);
  // list of Buckets
  const [buckets, setBuckets] = useState(newBuckets());

  /* 
  level of browsing : 
  -  genres
  -  artists (can be filtred by a genre)
  -  albums (can be filtred by an artist)
  -  mp3 of an album
  -  search 
  */
  const [level, setLevel] = useState<string>(_GENRES);
  /**
   * use filters for write, use debouncedFilters for reading and query
   * filters are set from different functions, this change are copied to debouncedFilters only 1s, so you can add multiple genre for example and doing only one query
   */
  const [filters, setFilters] = useState<FiltersType>(newFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<FiltersType>(newFilters);

  // set filters on each aggs change
  const debouncedFiltersTmp = useDebounce(filters, _DEBOUNCETIMEOUT);
  console.log(debouncedFiltersTmp)
  useEffect(() => {
    setDebouncedFilters(debouncedFiltersTmp);
  }, [debouncedFiltersTmp]);

  useEffect(() => {
    searchBuckets();
  }, [debouncedFilters]);

  async function searchBuckets() {
    if (!loading) {
      setLoading(true);
      let resDatas;
      if (level !== _MP3) {
        resDatas = await runQuery({ typeOfQuery: 'post', url: '/api/getaggs', filters: debouncedFilters });
        setBuckets(resDatas);
      }

      setLoading(false);
    }
    return null;
  }

  clj({debouncedFilters, level});

  return (
    <Box sx={isMobile ? mobileStyle : desktopStyle} id="SearchBucketsComponent">
      <Box>
        {renderTopBar()}

        {level === _GENRES && (
          <Bucket data={buckets?.genre} onSelect={(label: string) => handleSelect(level, label, _ARTISTS)} vignetsSize={vignetsSize} />
        )}
        {level === _ARTISTS && (
          <Bucket data={buckets?.artist} onSelect={(label: string) => handleSelect(level, label, _ALBUMS)} vignetsSize={vignetsSize} />
        )}
        {level === _ALBUMS && (
          <Bucket data={buckets?.album} onSelect={(label: string) => handleSelect(level, label, _MP3)} vignetsSize={vignetsSize} />
        )}
        {level === _MP3 && <PlayListWithQuery filters={debouncedFilters} changePlaylist={changePlaylist} />}
      </Box>
      {/*
        <Box sx={{}}>
          <SizeSlider size={vignetsSize} handleSize={setVignetsSize} />
        </Box>
      */}
    </Box>
  );

  function renderTopBar() {
    let label = 'mp3';
    switch (level) {
      case _ROOT:
        label = '';
        break;
      case _GENRES:
        label = 'Genres';
        break;
      case _ARTISTS:
        label = 'Artistes';
        break;
      case _ALBUMS:
        label = 'Albums';
        break;
    }

    return (
      <Breadcrumbs sx={{ marginLeft: '25px', marginTop: '25px', color: 'white' }} aria-label="breadcrumb" separator={<NavigateNextIcon />}>
        <Button variant="text" onClick={() => clearFilter(_ROOT)}>
          <HomeIcon sx={classes.breadcrumbLabel} fontSize="small" />
        </Button>

        {[_GENRES, _ARTISTS, _ALBUMS].map((t: string) => {
          return (
            //@ts-ignore
            debouncedFilters[t]?.length > 0 && (
              <Button key={t} variant="text" onClick={() => clearFilter(t)}>
                {/*@ts-ignore*/}
                <Typography sx={classes.breadcrumbLabel}> {upperFirstLetter(debouncedFilters[t].join(', '))}</Typography>
              </Button>
            )
          );
        })}

        <Button variant="text" onClick={() => handleSelect(null, null, _MP3)}>
          <Typography sx={classes.breadcrumbLabel}> Lire tout les {label}</Typography>
        </Button>
      </Breadcrumbs>
    );
  }

  function clearFilter(newLevel: string) {
    switch (newLevel) {
      case _ROOT:
        setFilters(newFilters);
        setLevel(_GENRES);
        break;
      case _GENRES:
        setFilters({ ...filters, [_ARTISTS]: [], [_ALBUMS]: [] });
        setLevel(_ARTISTS);
        break;
      case _ARTISTS:
        setFilters({ ...filters, [_ALBUMS]: [] });
        setLevel(_ALBUMS);
        break;
      case _ALBUMS:
        setLevel(_ALBUMS);
        break;
    }
  }

  /***
   *
   */
  function handleSelect(level: string | null, label: string | null, nextLevel: string) {
    console.log("handleSelect",level,nextLevel)
    if (level) {
      let nf = { ...filters };
      // @ts-ignore
      nf[level] = [...nf[level], label];

      setFilters(nf);
    }

    setTimeout(() => {
      setLevel(nextLevel);
    }, _DEBOUNCETIMEOUT);
  }
}
