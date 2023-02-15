


let api_path = "http://" + window.location.host + "/api";
let static_path = "http://78.202.14.12:3001/static";


const fontbasesize = 16;

export default {
  api_path,
  static_path,
  imageSize: 'min(400px,92vw)',
  windowRatioSize : window.innerWidth < 600 ? 100 : 125,
  spacings: {
    verytiny: "3px",
    tiny: "5px",
    small: "10px",
    medium: "20px",
    large: "30px",
    huge: "40px",
  },
  fontSizes: {
    xsmall: "0.625rem",
    small: "0.75rem",
    sm: "0.875rem",
    medium: "1rem",
    ml: "1.1rem",
    large: "1.25rem",
    xlarge: "1.5rem",
    xxlarge: "2.125rem",

    /*   xsmall: fontbasesize * 0.625,
   small: fontbasesize * 0.75,
   sm: fontbasesize * 0.875,
   medium: fontbasesize,
   ml: fontbasesize * 1.1,
   large: fontbasesize * 1.25,
   xlarge: fontbasesize * 1.5,
   xxlarge: fontbasesize * 2.125,*/

  },
  fontWeights: {
    light: 200,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  colors: {
    dividerColor: '#838387',
    white: "rgb(243, 244, 246)",
    verylightgray: "#f6f6f6",
    lightgray: "#C8CBCD",
    mediumgray: "#e6e6e6",
    gray: "#828282",
    verydarkgray: "#6c6969",
    black: "#000000",

  },
  const: {
    all: 'racine',
    genres: 'genre',
    artists: 'artist',
    albums: 'album',
    mp3: 'mp3',
  }
};
