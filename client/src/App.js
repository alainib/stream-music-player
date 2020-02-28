import React, { Component } from 'react';
import './App.css';

import Config from 'Config';
import { nextMusic } from 'services/music';

import ReactJkMusicPlayer from 'react-jinke-music-player';
import 'react-jinke-music-player/assets/index.css';

//import { _DATA } from './data.js';

var jsmediatags = window.jsmediatags;

let initOptions = {
  audioLists: [],
  theme: 'dark',
  remove: true,
  mode: 'full',
  showLyric: false,
  preload: true,
  autoPlay: true
};
class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audioLists: [],
      networkError: false,
      currentIndex: 0,
      currentData: {
        title: null,
        artist: null,
        year: null,
        genre: null,
        picture: null
      }
    };
  }

  componentDidMount() {
    this.loadMusic();
  }

  async loadMusic() {
    let res = await nextMusic();

    if (res) {
      let audioLists = [];
      for (let i in res) {
        audioLists.push({
          lyric: '',
          name: res[i].filename,
          musicSrc: Config.static_path + '/' + i + '.mp3',
          fullpath: res[i].fullpath
        });
      }

      this.readTag(audioLists[0]);
      // this.getData(_DATA.tags);
      this.setState({ audioLists });
    } else {
      this.setState({ networkError: true });
    }
  }

  // récupere les bonnes infos et set l'image
  getData(data) {
    var base64String = '';
    for (var i = 0; i < data.picture.data.length; i++) {
      base64String += String.fromCharCode(data.picture.data[i]);
    }
    var base64 = 'data:image/jpeg;base64,' + window.btoa(base64String);
    this.setState({
      currentData: {
        title: data.title,
        artist: data.artist,
        year: data.year,
        genre: data.gene,
        picture: base64
      }
    });
  }

  // lit depuis le mp3tag du fichier
  readTag = item => {
    jsmediatags.read(item.musicSrc, {
      onSuccess: data => {
        this.getData(data.tags);
      },
      onError: function(error) {
        console.log(error);
      }
    });
  };

  render() {
    let options = {
      ...initOptions,
      audioLists: this.state.audioLists
    };

    const { title, artist, year, genre, picture } = this.state.currentData;
    return (
      <div>
        <ReactJkMusicPlayer {...options} />
        {this.state.audioLists && (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <img width="300px" height="300px" src={picture} alt="Logo" />
            </div>
            <div>
              {this.state.audioLists.map((item, index) => {
                return (
                  <div key={index}>
                    <div
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        display: 'flex'
                      }}
                    >
                      {index} : {item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Music player</p>
        <Player />
      </header>
    </div>
  );
}

export default App;
