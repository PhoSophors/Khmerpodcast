import React, { useRef, useEffect } from "react";
import {
  StepBackwardFilled,
  StepForwardOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
} from "@ant-design/icons";
import "./PodcastPlayer.css";

const PodcastPlayer = ({ src, isPlaying, handlePlayPause }) => {
  const audioRef = useRef();

  useEffect(() => {
    // Update the audio element when isPlaying changes
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
          })
          .catch((error) => {
          });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="player-contrainer flex items-center justify-center space-x-4">

<div className="p-3 bg-indigo-800 h-full flex justify-center items-center rounded-full">
       sdf
      </div>


      <audio ref={audioRef} src={src} />
      <StepBackwardFilled style={{ fontSize: "2.5rem", color: "#fff" }} />

      {isPlaying ? (
        <PauseCircleFilled
          onClick={handlePlayPause}
          style={{ fontSize: "2.5rem", color: "#fff" }}
        />
      ) : (
        <PlayCircleFilled
          onClick={handlePlayPause}
          style={{ fontSize: "2.5rem", color: "#fff" }}
        />
      )}
      <StepForwardOutlined style={{ fontSize: "2.5rem", color: "#fff" }} />

      <div className="p-3 bg-indigo-800 h-full flex justify-center items-center rounded-full">
       sdfas
      </div>

    </div>
  );
};

export default PodcastPlayer;
