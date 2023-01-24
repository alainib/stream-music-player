import React, { useState, useContext, createContext } from 'react';

type ModalSearchBucketsContextType = {
  showModalSearchBuckets: boolean;
  setModalShowSearchBuckets: (arg0: boolean) => void;
  toggleShowModalSearchBuckets: () => void;
};

export const ModalSearchBucketsContext = createContext<ModalSearchBucketsContextType>({
  showModalSearchBuckets: false, // set a default value
  setModalShowSearchBuckets: (arg0:boolean) =>{},
  toggleShowModalSearchBuckets: () => {},
});

// the provider avoid to write <SearchBucketsContext.provider /> for main classe
export function ModalSearchBucketsContextProvider({ children }: any) {
  const { Provider } = ModalSearchBucketsContext;
  const [showModalSearchBuckets, setModalShowSearchBuckets] = useState(false);

  function toggleShowModalSearchBuckets() {
    setModalShowSearchBuckets(!showModalSearchBuckets);
    return null;
  }

  return <Provider value={{ showModalSearchBuckets, setModalShowSearchBuckets, toggleShowModalSearchBuckets }}>{children}</Provider>;
}

/**
 * to use in children class to access to this context
 *
 * usage
 *  import {useModalSearchBucketsContext} from "../hooks/SearchBucketsContext"
 *  const { showModalSearchBuckets, setModalShowSearchBuckets } = useModalSearchBucketsContext();
 */
export function useModalSearchBucketsContext() {
  const { showModalSearchBuckets, setModalShowSearchBuckets, toggleShowModalSearchBuckets } = useContext(ModalSearchBucketsContext);

  return { showModalSearchBuckets, setModalShowSearchBuckets ,toggleShowModalSearchBuckets};
}
