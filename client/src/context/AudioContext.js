import React, {
  createContext,
  useState,
  useContext,
  useRef,
} from "react";

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();
  
  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        setIsPlaying,
        setCurrentTrack,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} src={currentTrack} />
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);