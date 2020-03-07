import React, { Component } from "react";
import "./App.css";

import { Button } from "react-bootstrap";
import Config from "Config";
import { nextMusic, deleteTrack } from "services/music";

import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";

var jsmediatags = window.jsmediatags;

let initOptions = {
  audioLists: [],
  theme: "dark",
  remove: true,
  mode: "full",
  showLyric: false,
  preload: true,
  autoPlay: true,
  clearPriorAudioLists: true
};
class Player extends Component {
  constructor(props) {
    super(props);
    this.audioInstance = null;
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

  loadMusic = async () => {
    let res = await nextMusic();

    if (res) {
      let audioLists = [];
      for (let i in res) {
        audioLists.push({
          lyric: "lyric",
          name: res[i].filename,
          musicSrc: Config.static_path + res[i].fullpath,
          fullpath: Config.static_path + res[i].fullpath
        });
      }
      this.readTag(audioLists[0].musicSrc);
      this.setState({ audioLists, currentIndex: 0 });
      setTimeout(() => {
        this.audioInstance.load();
        console.log("load instance");
      }, 5000);
    } else {
      this.setState({ networkError: true });
    }
  };

  // récupere les bonnes infos et set l'image
  extractMp3InfoFromReadedTag(data) {
    let base64 = null;
    if (data.picture) {
      let base64String = "";
      for (let i = 0; i < data.picture.data.length; i++) {
        base64String += String.fromCharCode(data.picture.data[i]);
      }
      base64 = "data:image/jpeg;base64," + window.btoa(base64String);
    }
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
  readTag = musicSrc => {
    jsmediatags.read(musicSrc, {
      onSuccess: data => {
        this.extractMp3InfoFromReadedTag(data.tags);
      },
      onError: function(error) {
        console.log("read tag error", error);
      }
    });
  };

  // call after each audio is play ended
  onAudioEnded = (currentPlayId, audioLists, audioInfo) => {
    if (currentPlayId === audioLists[audioLists.length - 1].id) {
      this.loadMusic();
    }
  };

  onAudioPlay = audioInfo => {
    this.readTag(audioInfo.musicSrc);
    for (let i in this.state.audioLists) {
      if (audioInfo.fullpath === this.state.audioLists[i].fullpath) {
        this.setState({ currentIndex: i });
      }
    }
  };

  deleteTrackClick = fullpath => {
    deleteTrack(fullpath);
  };

  render() {
    let options = {
      ...initOptions,
      audioLists: this.state.audioLists
    };

    const { title, artist, year, genre, picture } = this.state.currentData;
    return (
      <div>
        {this.state.audioLists && this.state.audioLists.length > 0 && (
          <ReactJkMusicPlayer
            {...options}
            onAudioEnded={this.onAudioEnded}
            onAudioPlay={this.onAudioPlay}
            getAudioInstance={instance => (this.audioInstance = instance)}
          />
        )}
        {this.state.audioLists && (
          <div>
            {title}
            <br />
            {artist + " / " + genre + " / " + year}
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              <div>
                {picture && (
                  <img width="375px" height="375px" src={picture} alt="Logo" />
                )}
              </div>
              <div style={{ width: 25 }}></div>
              <div>
                {this.state.audioLists.map((item, index) => {
                  return (
                    <div key={index}>
                      <div
                        style={{
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          display: "flex",
                          backgroundColor:
                            this.state.currentIndex == index
                              ? "grey"
                              : "#282c34"
                        }}
                      >
                        {item.name}
                        {this.state.currentIndex == index && (
                          <Button
                            block
                            variant="secondary"
                            onClick={() => this.deleteTrackClick(item.fullpath)}
                          >
                            DELETE
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
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
        <Player />
      </header>
    </div>
  );
}

export default App;
