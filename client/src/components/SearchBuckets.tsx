import { useState, useEffect, useMemo } from 'react';

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
import { useModalSearchBucketsContext } from '../context/SearchBucketsContext';
import { upperFirstLetter } from '../tools';
import Config from '../Config';

const _windowRatioSize = window.innerWidth < 600 ? 100 : 125;

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
    level: _GENRES,
  };
}

type FiltersType = {
  genre: string[];
  artist: string[];
  album: string[];
  mp3: string[];
  level: string;
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
  const [filters, setFilters] = useState<FiltersType>(newFilters);

  useEffect(() => {
    searchBuckets();
  }, [filters]);

  async function searchBuckets() {
    if (!loading) {
      setLoading(true);
      let resDatas;
      if (filters.level !== _MP3) {
        setBuckets(newBuckets());

        resDatas = await runQuery({ typeOfQuery: 'post', url: '/api/getaggs', filters });
        setBuckets(resDatas);
      }

      setLoading(false);
    }
    return null;
  }

  console.log({ filters });

  return (
    <Box sx={isMobile ? mobileStyle : desktopStyle} id="SearchBucketsComponent">
      <Box>
        {renderTopBar()}

        {renderBuckets()}
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
    switch (filters.level) {
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
            filters[t]?.length > 0 && (
              <Button key={t} variant="text" onClick={() => clearFilter(t)}>
                {/*@ts-ignore*/}
                <Typography sx={classes.breadcrumbLabel}> {upperFirstLetter(filters[t].join(', '))}</Typography>
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

  function renderBuckets() {
    switch (filters.level) {
      case _GENRES:
        return (
          <Bucket
            data={buckets?.genre}
            onSelect={(labels: string[]) => handleSelect(filters.level, labels, _ARTISTS)}
            vignetsSize={vignetsSize}
          />
        );
      case _ARTISTS:
        return (
          <Bucket
            data={buckets?.artist}
            onSelect={(labels: string[]) => handleSelect(filters.level, labels, _ALBUMS)}
            vignetsSize={vignetsSize}
          />
        );
      case _ALBUMS:
        return (
          <Bucket
            data={buckets?.album}
            onSelect={(labels: string[]) => handleSelect(filters.level, labels, _MP3)}
            vignetsSize={vignetsSize}
          />
        );
      case _MP3:
        return <PlayListWithQuery filters={filters} changePlaylist={changePlaylist} />;
    }
  }

  function clearFilter(newLevel: string) {
    switch (newLevel) {
      case _ROOT:
        setFilters(newFilters);
        break;
      case _GENRES:
        setFilters({ ...filters, [_ARTISTS]: [], [_ALBUMS]: [], level: _ARTISTS });
        break;
      case _ARTISTS:
        setFilters({ ...filters, [_ALBUMS]: [], level: _ALBUMS });
        break;
      case _ALBUMS:
        setFilters({ ...filters, level: _ALBUMS });
        break;
    }
  }

  /***
   *
   */
  function handleSelect(level: string | null, labels: string[] | null, nextLevel: string) {
    let nf = { ...filters, level: nextLevel };

    if (level) {
      // @ts-ignore
      nf[level] = labels;
    }

    setFilters(nf);
  }
}
