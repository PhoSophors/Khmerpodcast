import React, { useEffect, useState } from "react";

import { useAudio } from "../../context/AudioContext";
import "./audioControl.css";
import {
  StepBackwardFilled,
  StepForwardOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeLow } from "@fortawesome/free-solid-svg-icons";
import { message } from "antd";

const AudioControl = () => {
  const {
    isPlaying,
    currentTrack,
    setIsPlaying,
    setCurrentTrack,
    podcasts,
    setCurrentPodcastIndex,
    audioRef,
  } = useAudio();

  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const currentPodcast = podcasts.find(
    (podcast) => podcast.audio.url === currentTrack
  );

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [volume, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;

    if (currentTrack && audio) {
      audio.src = currentTrack;

      const savedTime = localStorage.getItem("audioCurrentTime");
      if (savedTime !== null) {
        setCurrentTime(parseFloat(savedTime));
      }

      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (
              error.name === "NotAllowedError" ||
              error.name === "NotSupportedError"
            ) {
              message.error("Error playing audio");
            }
          });
        }
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrack, audioRef]);

  useEffect(() => {
    localStorage.setItem("audioCurrentTime", currentTime);
  }, [currentTime]);

  const handleNext = () => {
    const index = podcasts.findIndex(
      (podcast) => podcast.audio.url === currentTrack
    );
    if (index < podcasts.length - 1) {
      setCurrentPodcastIndex(index + 1);
      setCurrentTrack(podcasts[index + 1].audio.url);
    }
  };

  const handlePrevious = () => {
    const index = podcasts.findIndex(
      (podcast) => podcast.audio.url === currentTrack
    );
    if (index > 0) {
      setCurrentPodcastIndex(index - 1);
      setCurrentTrack(podcasts[index - 1].audio.url);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  return (
    <div className="audio-container mt-3">
      <div className="xl:w-96 md:w-96 w-96 items-center justify-center">
        <div className="play-back-container">
          <div className="play-back-btn gap-5">
            <StepBackwardFilled
              onClick={handlePrevious}
              style={{ fontSize: "2rem", color: `var(--audio-icon)` }}
            />
            {isPlaying ? (
              <PauseCircleFilled
                onClick={toggleAudio}
                style={{ fontSize: "2rem", color: `var(--audio-icon)` }}
              />
            ) : (
              <PlayCircleFilled
                onClick={toggleAudio}
                style={{ fontSize: "2rem", color: `var(--audio-icon)` }}
              />
            )}
            <StepForwardOutlined
              onClick={handleNext}
              style={{ fontSize: "2rem", color: `var(--audio-icon)` }}
            />
          </div>
          <div className="image-control">
            {currentPodcast && currentPodcast.image && (
              <img
                src={currentPodcast.image.url}
                alt={currentPodcast.title}
                className="thumbnail"
              />
            )}
          </div>
          <div className="volume-control gap-1">
            <FontAwesomeIcon icon={faVolumeLow} className="volume-icon-style" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              style={{ width: "100px" }}
            />
            <FontAwesomeIcon
              icon={faVolumeHigh}
              className="volume-icon-style"
            />
          </div>
        </div>

        <div className="time-control">
          <span style={{ fontSize: "0.7rem", color: "#6b7280", float: "left" }}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={isSeeking ? currentTime : currentTime}
            onChange={handleSeek}
            onMouseDown={handleSeekStart}
            onMouseUp={handleSeekEnd}
          />
          <span
            style={{ fontSize: "0.7rem", color: "#6b7280", float: "right" }}
          >
            -{formatTime(duration - currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Function to format time in MM:SS format
const formatTime = (time) => {
  if (isNaN(time)) {
    return "00:00";
  }

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return `${hours > 0 ? `${hours}:` : ""}${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

export default AudioControl;
