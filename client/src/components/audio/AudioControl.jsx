import React, { useRef, useEffect } from "react";
import {
  StepBackwardFilled,
  StepForwardOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
} from "@ant-design/icons";
import { useAudio } from '../../context/AudioContext'; // replace with the actual path

const AudioControl = () => {
  const audioRef = useRef();
  const { isPlaying, currentTrack, setIsPlaying } = useAudio();

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

  return (
    <div className="p-2 w-auto bg-slate-200 flex text-center items-center justify-center gap-5 rounded-full">
      <audio ref={audioRef} src={currentTrack} />
      <StepBackwardFilled style={{ fontSize: "2rem", color: "#000" }} />
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
      <StepForwardOutlined style={{ fontSize: "2rem", color: "#000" }} />
    </div>
  );
};

export default AudioControl;