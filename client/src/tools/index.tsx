import smoothscroll from 'smoothscroll-polyfill';
import Config from '../Config';

// return "" if string is null or undefined
export function cleanString(str: string) {
  if (typeof str !== 'string') {
    return '';
  }
  return str;
}

export function upperFirstLetter(str: string) {
  const _str = cleanString(str);
  return _str.charAt(0).toUpperCase() + _str.slice(1).toLowerCase();
}

/**
 * get a full path of an mp3 and return the fullpath to it's folder compressed image ( 400x400 px)
 * @param string path
 * @param string size : "small" "medium" "large"
 * @returns
 */
export function pathToFolderImageFromPath(path: string, size: string = 'medium') {
  const { pathToParentFolder } = extractInfoFromPath(path);
  const filename = size === 'small' ? '50.jpg' : size === 'medium' ? '100.jpg' : '400.jpg';
  return Config.static_path + '/' + pathToParentFolder + '/folder_' + filename;
}

smoothscroll.polyfill();
// scroll to the anchor with id
export function scrollToAnchor(id: string) {
  try {
    const element = document.getElementById(id);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('anchor not found ' + id);
    }
  } catch (error) {
    console.error('error in scrollToAnchor', error);
  }
}

// return fullpath, pathToParentFolder & filename from a full path to a file
export function extractInfoFromPath(fullpath: string) {
  let filename: string = '';
  let pathToParentFolder: string = '';
  try {
    if (!!fullpath) {
      const tmp = fullpath.split('/');
      tmp.shift();
      const tmp2 = tmp.map((elem) => encodeURIComponent(elem));
      filename = tmp2.pop() || '';
      pathToParentFolder = tmp2.join('/');
    }
  } catch (error) {
    console.log(fullpath);
    console.log(error);
  }

  return { filename, fullpath: pathToParentFolder + '/' + filename, pathToParentFolder };
}

interface lettersType {
  [key: string]: string;
}
/**
 *  return a color according to a char
 *  @param {string} c: a simple char, exemple the first letter of a mp3 name or artist/ so a ButtonBGImage display always the same color background
 */
export function charColor(c: string = 'a') {
  const colors: lettersType = {
    '0': '#800080',
    '1': '#dd2c00',
    '2': '#00bfa5',
    '3': '#FF7F50',
    '4': '#009688',
    '5': '#00bfa5',
    '6': '#3f51b5',
    '7': '#f44336',
    '8': '#FF7F50',
    '9': '#800080',
    a: '#EFC58C',
    b: '#008000',
    c: '#FF69B4',
    d: '#dd2c00',
    e: '#00bfa5',
    f: '#FF7F50',
    g: '#009688',
    h: '#00bfa5',
    i: '#B22222',
    j: '#008000',
    k: '#607d8b',
    l: '#009688',
    m: '#800080',
    n: '#EFC58C',
    o: '#ff9800',
    p: '#f44336',
    q: '#212121',
    r: '#00c853',
    s: '#01579b',
    t: '#3f51b5',
    u: '#B22222',
    v: '#3f51b5',
    w: '#f44336',
    x: '#FF7F50',
    y: '#800080',
    z: '#FF69B4',
  };

  return colors[c];
}

export function randomColor() {
  const colors = [
    '#EFC58C',
    '#008000',
    '#800080',
    '#FF7F50',
    '#B22222',
    '#FF69B4',
    '#f44336',
    '#3f51b5',
    '#009688',
    '#00bfa5',
    '#ff9800',
    '#212121',
    '#607d8b',
    '#dd2c00',
    '#00c853',
    '#01579b',
    '#e91e63',
  ];
  return colors[randMax(colors.length - 1)];
}

function randMax(max: number) {
  return Math.floor(Math.random() * (max + 1));
}


export function clj(props:any){
  console.log(JSON.stringify(props,null,2));
}