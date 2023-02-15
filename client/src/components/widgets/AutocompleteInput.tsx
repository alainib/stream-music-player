import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Mp3 } from '../../type';
import { runQuery } from '../../services/music';
import Config from '../../Config';

type AutocompleteInputProps = {
  onSelect: (track: Mp3) => null;
};

export default function AutocompleteInput({ onSelect }: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Mp3[]>([]);
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!!value && value.length > 2) {
      autoComplete(value);
    }
  }, [value]);

  async function autoComplete(value: string) {
    if (!loading) {
      setLoading(true);
      let title = value;
      let album = value;
      /**
       * l'affichage concatain titre + " - " + album
       * par ex l'user cherche "au dd", l'api répond { titlre :'au dd', album :'deux frères'}
       * l'AC affiche "au dd - deux frères"
       * si l'user reclic dans l'AC il faut que la recherche refonctionne
       */
      if (value.includes(' - ')) {
        [title, album] = value.split(' - ');
      }

      const list = await runQuery({ typeOfQuery: 'post', url: '/api/autocomplete', filters: { title, album } });
      console.log(list);
      setOptions(list);
      setLoading(false);
    }
    return null;
  }

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);


  return (
    <Autocomplete
      id="autocomplete-artist-title"
      sx={{ width: 400, backgroundColor: Config.colors.lightgray, borderRadius: '20px', margin: 1 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) => option.title + ' - ' + option.album}
      options={options}
      loading={loading}
      onChange={(event, newValue) => {
        if (newValue?.title) {
          onSelect(newValue);
        }
      }}
      inputValue={value}
      onInputChange={(event, newInputValue) => {
        setValue(newInputValue);
      }}
      isOptionEqualToValue={(option, value) => {
        return option?.title === value?.title || option?.album === value?.album;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Quel titre ou artist voulez vous écouter..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
