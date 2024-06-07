// PlayBtn.jsx
import React from "react";
import { useAudio } from "../../context/AudioContext";
import { PlayCircleFilled, PauseCircleFilled } from "@ant-design/icons";
import useView from "../../services/useView";

const PlayBtn = ({ file }) => {
  const {
    isPlaying,
    currentAudio,
    setCurrentId,
    setIsPlaying,
    setCurrentAudio,
    setCurrentImage,
    setCurrentTitle,
    setCurrentDescription,
  } = useAudio();

  const { incrementPlayCount } = useView();

  const toggleAudio = async () => {
    if (isPlaying && currentAudio === file.audio.url) {
      // If currently playing the same audio, just pause
      setIsPlaying(false);
    } else {
      // If not playing or playing a different audio, update audio info and play
      setCurrentId(file._id);
      setCurrentAudio(file.audio.url);
      setCurrentImage(file.image.url);
      setCurrentTitle(file.title);
      setCurrentDescription(file.description);
      setIsPlaying(true);

      await incrementPlayCount(file._id);
    }
  };

  return (
    <div>
      {isPlaying && currentAudio === file.audio.url ? (
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
