import { useState, useEffect } from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

import { Box, Button, Typography, Breadcrumbs } from '@mui/material';

import { ChangePlaylistProps, BucketsType, newBuckets } from '../../type';
import { runQuery } from '../../services/music';
import Bucket from '../Bucket';
import { PlayListWithQuery } from '../PlayList';

import {useLocalStorage} from '../../hooks/useLocalStorage';
import { upperFirstLetter } from '../../tools';
import Config from '../../Config';


const classes = {
  breadcrumbLabel: {
    height: '25px',
    color: 'white',
    textTransform: 'none',
  },
};

export default function BrowseBuckets({ changePlaylist }: ChangePlaylistProps) {
  // size of vignets
  const [vignetsSize, setVignetsSize] = useState<number>(Config.windowRatioSize);

  const [loading, setLoading] = useState<boolean>(false);
  // list of Buckets
  const [buckets, setBuckets] = useState<BucketsType>(newBuckets());

  /* 
  level of browsing : 
  -  genres
  -  artists (can be filtred by a genre)
  -  albums (can be filtred by an artist)
  -  mp3 of an album
  -  search 
  */
  const [filters, setFilters] = useLocalStorage('bucketsFilters', newFilters());

  useEffect(() => {
    search();
  }, [filters]);

  // search for all aggs
  async function search() {
    if (!loading) {
      setLoading(true);
    }
    let resDatas;
    if (filters.level !== Config.const.mp3) {
      resDatas = await runQuery({ typeOfQuery: 'post', url: '/api/getaggs', filters });
      setBuckets(resDatas);
    }

    setLoading(false);

    return null;
  }

  return (
    <Box>
      {renderBreadcrumbs()}
      {renderAllBuckets()}
      {/*
        <Box sx={{}}>
          <SizeSlider size={vignetsSize} handleSize={setVignetsSize} />
        </Box>
      */}
    </Box>
  );

  function renderBreadcrumbs() {
    let label = 'mp3';
    switch (filters.level) {
      case Config.const.all:
        label = 'Genres';
        break;
      case Config.const.genres:
        label = 'Artistes';
        break;
      case Config.const.artists:
        label = 'Albums';
        break;
      case Config.const.albums:
        label = 'mp3';
        break;
    }

    return (
      <Breadcrumbs sx={{ marginLeft: '25px', marginTop: '25px', color: 'white' }} aria-label="breadcrumb" separator={<NavigateNextIcon />}>
        <Button variant="text" onClick={() => clearFilter(Config.const.all)}>
          <HomeIcon sx={classes.breadcrumbLabel} fontSize="small" />
        </Button>

        {[Config.const.genres, Config.const.artists, Config.const.albums].map((t: string) => {
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

        <Button variant="text" onClick={() => handleSelectBucket(null)}>
          <Typography sx={classes.breadcrumbLabel}> Afficher tout les {label}</Typography>
        </Button>
      </Breadcrumbs>
    );
  }

  function clearFilter(newLevel: string) {
    switch (newLevel) {
      case Config.const.all:
        setFilters(newFilters);
        break;
      case Config.const.genres:
        setFilters({ ...filters, [Config.const.artists]: [], [Config.const.albums]: [], level: Config.const.artists });
        break;
      case Config.const.artists:
        setFilters({ ...filters, [Config.const.albums]: [], level: Config.const.albums });
        break;
      case Config.const.albums:
        setFilters({ ...filters, level: Config.const.albums });
        break;
    }
  }

  // handle a selected bucket, we can selection multiples buckets from same level
  function handleSelectBucket(labels: string[] | null) {
    const level = filters.level;
    let nextLevel;
    switch (level) {
      case Config.const.all:
        nextLevel = Config.const.genres;
        break;
      case Config.const.genres:
        nextLevel = Config.const.artists;
        break;
      case Config.const.artists:
        nextLevel = Config.const.albums;
        break;
      case Config.const.albums:
        nextLevel = Config.const.mp3;
        break;
    }

    let nf = { ...filters, level: nextLevel };

    if (labels) {
      // @ts-ignore
      nf[level] = labels;
    }

    setFilters(nf);
    setLoading(true);
  }

  function renderAllBuckets() {
    if (loading) {
      return null;
    }
    switch (filters.level) {
      case Config.const.genres:
        return <Bucket data={buckets?.genre} onSelect={(labels: string[]) => handleSelectBucket(labels)} vignetsSize={vignetsSize} />;
      case Config.const.artists:
        return <Bucket data={buckets?.artist} onSelect={(labels: string[]) => handleSelectBucket(labels)} vignetsSize={vignetsSize} />;
      case Config.const.albums:
        return <Bucket data={buckets?.album} onSelect={(labels: string[]) => handleSelectBucket(labels)} vignetsSize={vignetsSize} />;
      case Config.const.mp3:
        return <PlayListWithQuery filters={filters} changePlaylist={changePlaylist} />;
    }
  }

  function newFilters() {
    return {
      genre: [],
      artist: [],
      album: [],
      mp3: [],
      level: Config.const.genres,
    };
  }
}
