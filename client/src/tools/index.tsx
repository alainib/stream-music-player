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
export function getFolderImagePath(path: string, small: boolean = false) {
  const fullpath = Config.static_path + path;
  const filename = small ? '/folder_50.jpg' : '/folder_400.jpg';
  return fullpath.substring(0, fullpath.lastIndexOf('/')) + filename;
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

export function extractInfoFromName(fullpath: string) {
  let filename: string = '';
  let pathToParentFolder: string = '';
  if (!!fullpath) {
    const tmp = fullpath.split('/');
    filename = tmp[tmp.length - 1];
    pathToParentFolder = fullpath.substring(0, fullpath.lastIndexOf('/'));
  }
  return { filename, fullpath, pathToParentFolder };
}
