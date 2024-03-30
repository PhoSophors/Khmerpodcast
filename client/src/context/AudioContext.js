import React, { createContext, useState } from "react";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    currentTrack: null,
  });

  const playAudio = (trackUrl) => {
    setAudioState({ isPlaying: true, currentTrack: trackUrl });
  };

  const pauseAudio = () => {
    setAudioState({ isPlaying: false, currentTrack: null });
  };

  return (
    <AudioContext.Provider value={{ audioState, playAudio, pauseAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
