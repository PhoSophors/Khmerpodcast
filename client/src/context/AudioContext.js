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
  // const [podcasts, setPodcasts] = useState([]); // [podcast1, podcast2, podcast3, ...
  const [podcasts] = useState([]); 
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);
  const audioRef = useRef();
  
  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        setIsPlaying,
        setCurrentTrack,
        audioRef,
        podcasts,
        currentPodcastIndex,
        setCurrentPodcastIndex
      }}
    >
      {children}
      <audio ref={audioRef} src={currentTrack} />
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);