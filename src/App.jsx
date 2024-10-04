import React from 'react';
import MusicPlayer from './MusicPlayer';
import forestCreek from '/405138__mjeno__tiny-trickling-forest-creek-loopable.wav'
import WaterfallBig from '/690223__nox_sound__ambiance_waterfall_big_skogafoss_far_loop_stereo_02.wav'
import birdsLoop from '/393699__vdr3__birds-loop.flac'
import ducks from '/677248__drinkingwindgames__waddling-of-ducks.wav'
function App() {

  return (
    <>
    <div className="grid grid-cols-3 mt-80">
      <MusicPlayer music={{ url: forestCreek, name:"Forest Creek", img:"icons8-forest-96.png"}}></MusicPlayer>
      <MusicPlayer music={{ url: WaterfallBig, name:"WaterFall", img:"icons8-waterfall-96.png"}}></MusicPlayer>
      <MusicPlayer music={{ url: birdsLoop, name:"Birds", img:"icons8-quail-96.png" }}></MusicPlayer>
      <MusicPlayer music={{ url: ducks, name:"Ducks", img:"icons8-flying-duck-96.png" }}></MusicPlayer>
    </div>
    
    </>
  );
}

export default App;

