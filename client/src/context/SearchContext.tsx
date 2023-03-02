import React, { useState, useContext, createContext } from 'react';

type ModalSearchContextType = {
  showModalSearch: boolean;
  setModalShowSearch: (arg0: boolean) => void;
  toggleShowModalSearch: () => void;
};

export const ModalSearchContext = createContext<ModalSearchContextType>({
  showModalSearch: false, // set a default value
  setModalShowSearch: (arg0:boolean) =>{},
  toggleShowModalSearch: () => {},
});

// the provider avoid to write <SearchContext.provider /> for main classe
export function ModalSearchContextProvider({ children }: any) {
  const { Provider } = ModalSearchContext;
  const [showModalSearch, setModalShowSearch] = useState(false);

  function toggleShowModalSearch() {
    setModalShowSearch(!showModalSearch);
    return null;
  }

  return <Provider value={{ showModalSearch, setModalShowSearch, toggleShowModalSearch }}>{children}</Provider>;
}

/**
 * to use in children class to access to this context
 *
 * usage
 *  import {useModalSearchContext} from "../context/SearchContext"
 *  const { showModalSearch, setModalShowSearch } = useModalSearchContext();
 */
export function useModalSearchContext() {
  const { showModalSearch, setModalShowSearch, toggleShowModalSearch } = useContext(ModalSearchContext);

  return { showModalSearch, setModalShowSearch ,toggleShowModalSearch};
}
