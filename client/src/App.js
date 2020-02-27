import React, { Component } from "react";
import "./App.css";

import Config from "Config";
import { nextMusic } from "services/music";

import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";

let initOptions = {
  audioLists: [],
  theme: "dark",
  remove: true,
  mode: "full",
  showLyric: false,
  preload:true,
  autoPlay:true

};
class Player extends Component {
  constructor(props) {
    super(props);

    this.state = { audioLists: [], networkError: false, current: 0 };
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
          lyric: "",
          name: res[i].filename,
          musicSrc: Config.static_path + "/" + i + ".mp3",
          musicSrc2: () => {
            return Promise.resolve(Config.static_path + "/" + i + ".mp3");
          },
          fullpath: res[i].fullpath,
        });
      }
      this.setState({ audioLists });
    } else {
      this.setState({ networkError: true });
    }
  }

  render() {
    let options = {
      ...initOptions,
      audioLists: this.state.audioLists
    };

    console.log("audioLists", this.state.audioLists);
    return (
      <div>
        <ReactJkMusicPlayer {...options} />
        {this.state.audioLists &&
          this.state.audioLists.map((item, index) => {
            return (
              <div key={index}>
                <div
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    display: "flex"
                  }}
                >
                  {index} : {item.name}
                </div>
              </div>
            );
          })}
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
