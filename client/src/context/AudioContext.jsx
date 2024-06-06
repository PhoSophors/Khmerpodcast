import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentId, setCurrentId] = useState(
    localStorage.getItem("currentId") || null
  );
  const [currentAudio, setCurrentAudio] = useState(
    localStorage.getItem("currentAudio") || null
  );
  const [currentImage, setCurrentImage] = useState(
    localStorage.getItem("currentImage") || null
  );
  const [currentTitle, setCurrentTitle] = useState(
    localStorage.getItem("currentTitle") || null
  );
  const [currentDescription, setCurrentDescription] = useState(
    localStorage.getItem("currentDescription") || null
  );
  const [currentTime, setCurrentTime] = useState(
    parseFloat(localStorage.getItem("currentTime")) || 0
  );
  const [duration, setDuration] = useState(
    parseFloat(localStorage.getItem("duration")) || 0
  );
  const [isSeeking, setIsSeeking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);
  const audioRef = useRef();

  useEffect(() => {
    if (currentId) {
      localStorage.setItem("currentId", currentId);
    } else {
      localStorage.removeItem("currentId");
    }
  }, [currentId]);

  useEffect(() => {
    if (currentAudio) {
      localStorage.setItem("currentAudio", currentAudio);
    } else {
      localStorage.removeItem("currentAudio");
    }
  }, [currentAudio]);

  useEffect(() => {
    if (currentImage) {
      localStorage.setItem("currentImage", currentImage);
    } else {
      localStorage.removeItem("currentImage");
    }
  }, [currentImage]);

  useEffect(() => {
    if (currentTitle) {
      localStorage.setItem("currentTitle", currentTitle);
    } else {
      localStorage.removeItem("currentTitle");
    }
  }, [currentTitle]);

  useEffect(() => {
    if (currentDescription) {
      localStorage.setItem("currentDescription", currentDescription);
    } else {
      localStorage.removeItem("currentDescription");
    }
  }, [currentDescription]);

  useEffect(() => {
    if (currentTime) {
      localStorage.setItem("currentTime", currentTime.toString());
    } else {
      localStorage.removeItem("currentTime");
    }
  }, [currentTime]);

  const handleSetCurrentTime = (newTime) => {
    setCurrentTime(newTime);
    localStorage.setItem("currentTime", newTime.toString());
  };

  useEffect(() => {
    if (duration) {
      localStorage.setItem("duration", duration.toString());
    } else {
      localStorage.removeItem("duration");
    }
  }, [duration]);

  useEffect(() => {
    if (isSeeking) {
      localStorage.setItem("isSeeking", isSeeking.toString());
    } else {
      localStorage.removeItem("isSeeking");
    }
  }, [isSeeking]);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        isPlaying,
        currentId,
        currentAudio,
        currentImage,
        currentTitle,
        currentDescription,
        currentPodcastIndex,
        currentTime,
        setIsPlaying,
        setCurrentId,
        setCurrentAudio,
        setCurrentImage,
        setCurrentTitle,
        setCurrentDescription,
        setCurrentPodcastIndex,
        setCurrentTime,
        duration,
        setDuration,
        isSeeking,
        setIsSeeking,

        handleSetCurrentTime,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
