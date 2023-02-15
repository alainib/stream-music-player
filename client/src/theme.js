import {createTheme} from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: ({ownerState}) => ({
         
        }),
      },
    },
  },


});