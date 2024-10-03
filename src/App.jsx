import React from 'react';
import MusicPlayer from './MusicPlayer';
import forestCreek from '/405138__mjeno__tiny-trickling-forest-creek-loopable.wav'
import WaterfallBig from '/690223__nox_sound__ambiance_waterfall_big_skogafoss_far_loop_stereo_02.wav'
import birdsLoop from '/393699__vdr3__birds-loop.flac'
import ducks from '/677248__drinkingwindgames__waddling-of-ducks.wav'
function App() {

  return (
    <>
      <MusicPlayer music={{ url: forestCreek, name:"Forest Creek" }}></MusicPlayer>
      <MusicPlayer music={{ url: WaterfallBig, name:"WaterFall"}}></MusicPlayer>
      <MusicPlayer music={{ url: birdsLoop, name:"Birds" }}></MusicPlayer>
      <MusicPlayer music={{ url: ducks, name:"Ducks" }}></MusicPlayer>
    
    </>
  );
}

export default App;

