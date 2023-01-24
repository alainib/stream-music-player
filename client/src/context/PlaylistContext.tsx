import React, { useState, useContext, createContext } from 'react';

type ModalPlaylistContextType = {
  showModalPlaylist: boolean;
  setModalShowPlaylist: (arg0: boolean) => void;
  toggleShowModalPlaylist: () => void;
};

export const ModalPlaylistContext = createContext<ModalPlaylistContextType>({
  showModalPlaylist: false, // set a default value
  setModalShowPlaylist: (arg0:boolean) =>{},
  toggleShowModalPlaylist: () => {},
});

// the provider avoid to write <PlaylistContext.provider /> for main classe
export function ModalPlaylistContextProvider({ children }: any) {
  const { Provider } = ModalPlaylistContext;
  const [showModalPlaylist, setModalShowPlaylist] = useState(false);

  function toggleShowModalPlaylist() {
    setModalShowPlaylist(!showModalPlaylist);
    return null;
  }

  return <Provider value={{ showModalPlaylist, setModalShowPlaylist, toggleShowModalPlaylist }}>{children}</Provider>;
}

/**
 * to use in children class to access to this context
 *
 * usage
 *  import {useModalPlaylistContext} from "../hooks/PlaylistContext"
 *  const { showModalPlaylist, setModalShowPlaylist } = useModalPlaylistContext();
 */
export function useModalPlaylistContext() {
  const { showModalPlaylist, setModalShowPlaylist, toggleShowModalPlaylist } = useContext(ModalPlaylistContext);

  return { showModalPlaylist, setModalShowPlaylist ,toggleShowModalPlaylist};
}
