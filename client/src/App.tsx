import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { styled, ThemeProvider } from '@mui/material/styles';

import { Signin } from './components/User/Signin';
import { MusicPlayer } from './components/MusicPlayer';
import { ModalPlaylistContextProvider } from './context/PlaylistContext';
import { UserContext } from './context/UserContext';
import { useLocalStorage } from './hooks/useLocalStorage';

import { theme } from './theme';

const WallPaper = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: 'url(../blue-gradients.020-wh.jpg) top center/cover no-repeat fixed ',
});
/*background: '#171717',  
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&:before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background: 'radial-gradient(at center center, rgb(150, 152, 176) 0%, rgba(150, 152, 176, 0) 64%)',
  },
  '&:after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    //background: 'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
    background: 'radial-gradient(at center center, rgb(112, 73, 93) 0%, rgba(112, 73, 93, 0) 70%)',
    transform: 'rotate(30deg)',
  },
  */

function App() {
  const { Provider } = UserContext;
  let navigate = useNavigate();
  const [user, setUser] = useLocalStorage('user', {});

  useEffect(() => {
    if (!user?.accessToken) {
      navigate('/login');
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <Provider value={{ user, setUser }}>
        <ModalPlaylistContextProvider>
          <Routes>
            <Route index element={<MusicPlayer />} />
            <Route path="/login" element={<Signin />} />
          </Routes>
        </ModalPlaylistContextProvider>
      </Provider>
      <WallPaper id="wallpaper" />
    </ThemeProvider>
  );
}

export default App;
