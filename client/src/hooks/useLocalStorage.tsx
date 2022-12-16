import { useEffect, useState } from 'react';

function getStorageValue(key: string, defaultValue: any) {
  // getting stored value
  const initial = localStorage?.getItem(key) ? JSON.parse(localStorage.getItem(key) || "") : defaultValue ;
  //console.log({ key, initial, defaultValue });
  return initial   ;
}

/**
 * 
usage 
  import { useLocalStorage } from "../useLocalStorage";
  const [name, setName] = useLocalStorage("name", "");
 */
export default function useLocalStorage(key: string, defaultValue: any) {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
