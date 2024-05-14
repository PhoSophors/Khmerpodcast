// PlayBtn.jsx
import React from "react";
import { useAudio } from "../../context/AudioContext";
import { PlayCircleFilled, PauseCircleFilled } from "@ant-design/icons";

const PlayBtn = ({ file }) => {
  const { isPlaying, currentTrack, setIsPlaying, setCurrentTrack } = useAudio();

  const toggleAudio = () => {
    if (currentTrack === file.audio.url) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(file.audio.url);
      setIsPlaying(true);
    }
  };

  return (
    <div>
      {isPlaying && currentTrack === file.audio.url ? (
        <PauseCircleFilled
          onClick={toggleAudio}
          style={{ fontSize: "2rem", color: "#fbbf24" }}
        />
      ) : (
        <PlayCircleFilled
          onClick={toggleAudio}
          style={{ fontSize: "2rem", color: "#fbbf24" }}
          />
        )}
      </div>
    );
  };
  
  export default PlayBtn;
  