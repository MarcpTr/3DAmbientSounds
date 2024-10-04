


import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';
function MusicPlayer({ music }) {
  const styles = {
    play: {
    },
    stop: {
      filter: "brightness(01) saturate(100%) invert(17%) sepia(100%) saturate(2905%) hue-rotate(360deg)  contrast(114%)"

    },
  };
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const pannerNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [rotationTime, setRotationTime] = useState(5);
  const [data, setData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [timeStart, setTimeStart] = useState(0)

  useEffect(() => {
    fetch(music.url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        setData(arrayBuffer);
      });
  }, []);

  useEffect(() => {
    if (data) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      audioContext.decodeAudioData(data)
        .then(decodedBuffer => {
          audioBufferRef.current = decodedBuffer;
          setLoaded(true)
        })
        .catch(error => console.error('Error al decodificar el audio:', error));
    }
  }, [data]);

  function playAudio() {

    if (audioBufferRef.current && audioContextRef.current && !isPlaying) {
      const audioContext = audioContextRef.current;


      const sourceNode = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const pannerNode = audioContext.createPanner();

      sourceNode.buffer = audioBufferRef.current;
      sourceNode.loop = true
      pannerNode.panningModel = 'HRTF';
      pannerNode.distanceModel = 'inverse';
      pannerNode.refDistance = 1;
      pannerNode.maxDistance = 100;
      pannerNode.rolloffFactor = 1;
      pannerNode.coneInnerAngle = 360;
      pannerNode.coneOuterAngle = 0;
      pannerNode.coneOuterGain = 0;

      gainNode.gain.value = volume;

      sourceNode.connect(pannerNode);
      pannerNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      sourceNodeRef.current = sourceNode;
      gainNodeRef.current = gainNode;
      pannerNodeRef.current = pannerNode;

      setTimeStart(Date.now())

      sourceNode.start(0, currentTime);

      sourceNode.onended = () => {
        setIsPlaying(false);
      };
      setIsPlaying(true);

    }
  }
  useEffect(() => {
    stopRotation();
    startRotation();
  }, [rotationTime])
  function stopAudio() {
    if (sourceNodeRef.current && isPlaying) {
      const elapsedTime = (Date.now() / 1000 - (timeStart / 1000) + currentTime || 0);
      setCurrentTime(elapsedTime);



      sourceNodeRef.current.stop(0);
      setIsPlaying(false);
      sourceNodeRef.current.disconnect();
      pannerNodeRef.current.disconnect();
      gainNodeRef.current.disconnect();

      sourceNodeRef.current = null;
      pannerNodeRef.current = null;
      gainNodeRef.current = null;
    }
    if (isRotating) {
      stopRotation();
    }
  }

  function startRotation() {

    if (pannerNodeRef.current) {
      let angle = 0;
      //Tiempo
      intervalRef.current = setInterval(() => {
        angle += (360 / (rotationTime * 1000)) * 10;
        const radians = (angle * Math.PI) / 180;
        const radius = 1;

        const x = Math.sin(radians) * radius;
        const z = Math.cos(radians) * radius;
        pannerNodeRef.current.positionX.setValueAtTime(x, audioContextRef.current.currentTime);
        pannerNodeRef.current.positionZ.setValueAtTime(z, audioContextRef.current.currentTime);
      }, 10);
      //velocidad
      // intervalRef.current = setInterval(() => {
      //   angle += 5 * rotationTime; // Incrementar el ángulo para rotar
      //   const radians = (angle * Math.PI) / 180; // Convertir a radianes
      //   const radius = 1; // Radio de la rotación
      //   console.log(angle)
      //   // Calcular la nueva posición X y Z usando coordenadas polares
      //   const x = Math.sin(radians) * radius;
      //   const z = Math.cos(radians) * radius;

      //   // Actualizar la posición del PannerNode
      //   pannerNodeRef.current.positionX.setValueAtTime(x, audioContextRef.current.currentTime);
      //   pannerNodeRef.current.positionZ.setValueAtTime(z, audioContextRef.current.currentTime);
      // }, 10);
      setIsRotating(true);
    }
  }

  function stopRotation() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRotating(false);
    }
  }


  const handleChange = (event) => {
    let value = event.target.value;
    if (event.target.id === "volumeControl") {
      const volumeValue = parseFloat(value);
      setVolume(volumeValue);
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setValueAtTime(volumeValue, audioContextRef.current.currentTime);
      }
    }
    if (event.target.id === "speedControl") {
      const timeValue = parseFloat(value);
      setRotationTime(timeValue);
    }

  };

  return (
    <>
    <article>
      <h1>{isPlaying ? "Reproduciendo: " + music.name : music.name}</h1>
      
      <div className="relative  h-36 w-36">
        <img src={music.img} id="playButton" onClick={!isPlaying ? playAudio : stopAudio} style={isPlaying ? styles.play : styles.stop} className="h-36 w-36" disabled={!loaded}></img> 
         <img src="icons8-rotate-96.png" id="rotateButton" style={(isRotating ? null :  styles.stop )} onClick={isRotating ? stopRotation : startRotation} className={(isRotating ? "animate-spin" :  "" ) + " absolute right-0 bottom-0 h-14 w-14"}></img>
      </div>

      <label htmlFor="volumeControl">Volumen: </label>
      <input
        onChange={handleChange}
        type="range"
        id="volumeControl"
        min="0"
        max="1"
        step="0.01"
        value={volume}
      />
      <input
        onChange={handleChange}
        type="range"
        id="speedControl"
        min="0.5"
        max="10"
        step="0.1"
        value={rotationTime}
      />
      <span id="timeValue">{rotationTime}</span>
      </article>
    </>
  );
}

export default MusicPlayer;