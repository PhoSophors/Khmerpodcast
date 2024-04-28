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
  const {
    isPlaying,
    currentTrack,
    setIsPlaying,
    currentPodcastIndex,
    setCurrentPodcastIndex,
    setCurrentTrack,
    podcasts,
  } = useAudio();

  const handlePlayPause = () => {
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
    if (currentPodcastIndex < podcasts.length - 1) {
      const newIndex = currentPodcastIndex + 1;
      setCurrentPodcastIndex(newIndex);
      setCurrentTrack(podcasts[newIndex].audio.url);
    }
  };
  
  const handlePrevious = () => {
    if (currentPodcastIndex > 0) {
      const newIndex = currentPodcastIndex - 1;
      setCurrentPodcastIndex(newIndex);
      setCurrentTrack(podcasts[newIndex].audio.url);
    }
  };

  return (
    <div className="p-2 w-auto bg-slate-200 flex text-center items-center justify-center gap-5 rounded-full">
      <audio ref={audioRef} src={currentTrack} />
      <StepBackwardFilled onClick={handlePrevious} style={{ fontSize: "2rem", color: "#000" }} />
      {isPlaying ? (
        <PauseCircleFilled
          onClick={handlePlayPause}
          style={{ fontSize: "2rem", color: "#000" }}
        />
      ) : (
        <PlayCircleFilled
          onClick={handlePlayPause}
          style={{ fontSize: "2rem", color: "#000" }}
        />
      )}
      <StepForwardOutlined onClick={handleNext} style={{ fontSize: "2rem", color: "#000" }} />
    </div>
  );
};

export default AudioControl;
