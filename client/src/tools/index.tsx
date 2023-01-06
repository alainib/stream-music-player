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
  return _str.charAt(0).toUpperCase() + _str.slice(1);
}

/**
 * get a full path of an mp3 and return the fullpath to it's folder compressed image ( 400x400 px)
 * @param path
 * @param small
 * @returns
 */
export function pathToFolderImageFromPath(path: string, small: boolean = false) {
  const { pathToParentFolder } = extractInfoFromPath(path);
  const filename = small ? '50.jpg' : '400.jpg';
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
  let filename: string | undefined = '';
  let pathToParentFolder: string = '';

  if (!!fullpath) {
    const tmp = fullpath.split('/');
    tmp.shift();
    const tmp2 = tmp.map((elem) => encodeURIComponent(elem));
    filename = tmp2.pop();
    pathToParentFolder = tmp2.join('/');
  }
  return { filename, fullpath: pathToParentFolder + '/' + filename, pathToParentFolder };
}

// return a random color
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
