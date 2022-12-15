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

export function getFolderImagePath(path: string, small: boolean = false) {
  const fullpath = Config.static_path + path;
  const filename = small ? '/folder_50.jpg' : '/folder_400.jpg';
  return fullpath.substring(0, fullpath.lastIndexOf('/')) + filename;
}
