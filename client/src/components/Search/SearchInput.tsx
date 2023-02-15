import { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

import { Box, Button, InputBase, IconButton, Typography } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

import Config from '../../Config';
import useDebounce from '../../hooks/useDebounce';
import { ChangePlaylistProps, BucketType, Mp3 } from '../../type';
import Bucket from '../Bucket';

import { PlayListWithQuery, PlayList } from '../PlayList';
import { runQuery } from '../../services/music';

const classes = {
  container: {
    width: 'min(98vw,400px)',
    margin: 1,
    marginTop: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  subContainer: {
    width: '100%',
    backgroundColor: Config.colors.lightgray,
    borderRadius: '8px',
    marginLeft: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
    position: 'relative',
  },
  inputBase: { color: 'black', padding: '2px 14px' },
  category: {
    flex: 1,
    marginTop: 1,
    color: Config.colors.white,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

type SearchResultType = {
  album: BucketType[];
  hits: Mp3[];
} | null;

export type HideOtherProps = {
  hideOther: (val: boolean) => null;
};

type SearchInputProps = ChangePlaylistProps & HideOtherProps;

export default function SearchInput({ hideOther, changePlaylist }: SearchInputProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInput = useDebounce(inputValue, 500);

  const [loading, setLoading] = useState<boolean>(false);

  // list of Buckets for title and album for user input search only, browsing buckets in handled in SearchBuckets
  const [searchResult, setSearchResult] = useState<SearchResultType | null>(null);

  const [album, setAlbum] = useState<string[] | null>(null);

  useEffect(() => {
    hideOther(!!debouncedInput && debouncedInput?.length > 1);
    if (debouncedInput?.length > 0) {
      search();
    } else {
      setSearchResult(null);
    }
  }, [debouncedInput]);

  // search for all aggs
  async function search() {
    if (!loading) {
      setLoading(true);
    }
    let resDatas;
    resDatas = await runQuery({ typeOfQuery: 'post', url: '/api/search', filters: { value: debouncedInput } });
    setSearchResult(resDatas);
    console.log(resDatas);

    setLoading(false);

    return null;
  }

  return (
    <Box>
      {renderInput()}
      {renderResults()}
    </Box>
  );

  function renderInput() {
    return (
      <Box sx={classes.container}>
        <IconButton disabled={album === null} aria-label="previous" onClick={handlePrevious} sx={{ zIndex: 1 }}>
          <ArrowLeftIcon fontSize="large" htmlColor={album === null ? Config.colors.gray : Config.colors.lightgray} />
        </IconButton>
        <Box sx={classes.subContainer}>
          <InputBase
            onChange={handleOnChangeInputValue}
            placeholder="titre ou artist"
            fullWidth={true}
            value={inputValue}
            sx={classes.inputBase}
          />
          <Button variant="text" onClick={() => setInputValue('')}>
            <ClearIcon sx={{ color: inputValue?.length > 0 ? 'black' : Config.colors.lightgray }} fontSize="small" />
          </Button>
        </Box>
      </Box>
    );
  }

  // handle selection made from Autocomplete
  function handleOnChangeInputValue(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event?.target?.value || '');
    return null;
  }

  function renderResults() {
    if (!!album) {
      return <PlayListWithQuery filters={{ album }} changePlaylist={changePlaylist} />;
    }
    if (!!debouncedInput && debouncedInput?.length > 1) {
      return (
        <Box>
          {searchResult && searchResult?.album?.length > 0 && (
            <>
              <Typography variant="h5" sx={classes.category}>
                Albums :
              </Typography>
              <Bucket data={searchResult?.album} onSelect={handleSelectAlbum} vignetsSize={Config.windowRatioSize} />
            </>
          )}
          <Typography variant="h5" sx={classes.category}>
            Titres :
          </Typography>
          {searchResult?.hits && (
            <PlayList
              list={searchResult?.hits}
              onTrackChange={handleTrackChange}
              //onSearch={onSearch}
            />
          )}
        </Box>
      );
    } else {
      return null;
    }
  }

  function handleSelectAlbum(props: string[]) {
    console.log(props);
    setAlbum(props);
  }

  function handlePrevious() {
    setAlbum(null);
  }

  function handleTrackChange(i: number) {
    if (searchResult?.hits) {
      changePlaylist(searchResult.hits, i, inputValue);
    }
    return null;
  }
}
