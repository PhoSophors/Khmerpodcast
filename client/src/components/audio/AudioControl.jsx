import React, { useRef, useEffect } from "react";
import {
  StepBackwardFilled,
  StepForwardOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
} from "@ant-design/icons";
import { useAudio } from "../../context/AudioContext";

const AudioControl = () => {
  const audioRef = useRef();
  // const [currentTime, setCurrentTime] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [isDurationSet, setIsDurationSet] = useState(false);
  const {
    isPlaying,
    currentTrack,
    setIsPlaying,
    setCurrentTrack,
    podcasts,
    setCurrentPodcastIndex,
    // audioRef: globalAudioRef,
  } = useAudio();

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then((_) => {}).catch((error) => {});
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleNext = () => {
    const index = podcasts.findIndex((podcast) => podcast.audio.url === currentTrack);
    if (index < podcasts.length - 1) {
      setCurrentPodcastIndex(index + 1);
      setCurrentTrack(podcasts[index + 1].audio.url);
    }
  };

  const handlePrevious = () => {
    const index = podcasts.findIndex((podcast) => podcast.audio.url === currentTrack);
    if (index > 0) {
      setCurrentPodcastIndex(index - 1);
      setCurrentTrack(podcasts[index - 1].audio.url);
    }
  };

  // const handleSeekChange = (e) => {
  //   if (audioRef.current) {
  //     audioRef.current.currentTime = e.target.value;
  //     setCurrentTime(e.target.value);
  //   }
  // };

  // const handleLoadedMetadata = () => {
  //   if (!isDurationSet) {
  //     setDuration(audioRef.current.duration);
  //     setIsDurationSet(true);
  //   }
  // };

  // const handleDurationChange = () => {
  //   setDuration(audioRef.current.duration);
  // };

  return (
    <div className="p-2 w-96 bg-slate-200 flex text-center items-center justify-center gap-5 rounded-xl">
      <audio
        ref={audioRef}
        src={currentTrack}
        // onLoadedMetadata={handleLoadedMetadata}
        // onDurationChange={handleDurationChange}
        // onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
      />
      <StepBackwardFilled
        onClick={handlePrevious}
        style={{ fontSize: "2rem", color: "#000" }}
      />
      {isPlaying ? (
        <PauseCircleFilled
          onClick={toggleAudio}
          style={{ fontSize: "2rem", color: "#000" }}
        />
      ) : (
        <PlayCircleFilled
          onClick={toggleAudio}
          style={{ fontSize: "2rem", color: "#000" }}
        />
      )}
      <StepForwardOutlined
        onClick={handleNext}
        style={{ fontSize: "2rem", color: "#000" }}
      />
      {/* <input
        type="range"
        value={currentTime}
        max={duration}
        onChange={handleSeekChange}
      /> */}
    </div>
  );
};

export default AudioControl;
