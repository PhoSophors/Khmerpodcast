import React, { useEffect } from "react";
import { useAudio } from "../../context/AudioContext";
import { Link } from "react-router-dom";
import "./audioControl.css";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  FastForwardFilled,
  FastBackwardFilled,
} from "@ant-design/icons";
import { message } from "antd";

const AudioControl = () => {
  const {
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    isSeeking,
    setIsSeeking,
    currentId,
    currentAudio,
    audioRef,
    currentImage,
    currentTitle,
    currentDescription,
    handleSetCurrentTime,
  } = useAudio();

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFastForward = () => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Math.min(audio.currentTime + 30, audio.duration);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRewind = () => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Math.max(audio.currentTime - 30, 0);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [audioRef, setCurrentTime, setDuration]);

  useEffect(() => {
    const audio = audioRef.current;

    if (currentAudio && audio) {
      audio.src = currentAudio;

      const savedTime = localStorage.getItem("currentTime");

      if (savedTime !== null) {
        audio.currentTime = parseFloat(savedTime);
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
  }, [currentAudio, isPlaying]);

  useEffect(() => {
    localStorage.setItem("audioCurrentTime", currentTime);
  }, [currentTime]);

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

  if (!currentAudio) {
    return null;
  }

  const calculateDuration = (text) => {
    const baseDuration = 10;
    const baseLength = 5;
    return (text.length / baseLength) * baseDuration;
  };

  return (
    <div className="audio-container mt-3">
      <div className="xl:w-96 md:w-96 w-96 items-center justify-center">
        <div className="play-back-container">
          <div className="image-control gap-3 mt-5">
            <div>
              <Link to={`/watch-podcast/${currentId}`}>
                {currentImage && <img src={currentImage} alt="Current track" />}
              </Link>
            </div>

            <div className="flex flex-col">
              <div className=" w-52">
                <span className=" line-clamp-1 mt-1 font-semibold dark:text-gray-300">
                  {currentTitle}
                </span>
              </div>
              <div className="marquee w-52 line-clamp-1">
                <span
                  className=" marquee-text text-gray-400"
                  style={{
                    animationDuration: `${calculateDuration(currentTitle)}s`,
                  }}
                >
                  {currentDescription}
                </span>
              </div>
            </div>
          </div>

          <div className="play-back-btn gap-5">
            <FastBackwardFilled
              onClick={handleRewind}
              style={{ fontSize: "1.6rem", color: `var(--audio-icon)` }}
            />
            {isPlaying ? (
              <PauseCircleFilled
                onClick={toggleAudio}
                style={{ fontSize: "1.6rem", color: `var(--audio-icon)` }}
              />
            ) : (
              <PlayCircleFilled
                onClick={toggleAudio}
                style={{ fontSize: "1.6rem", color: `var(--audio-icon)` }}
              />
            )}
            <FastForwardFilled
              onClick={handleFastForward}
              style={{ fontSize: "1.6rem", color: `var(--audio-icon)` }}
            />
          </div>
        </div>

        <div>
          <div className="text-end"  style={{ userSelect: "none" }}>
            <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
              {formatTime(currentTime)}
            </span>
            <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
              /-{formatTime(duration - currentTime)}
            </span>
          </div>
          <div className="time-control">
            <input
              type="range"
              min="0"
              max={duration}
              value={isSeeking ? currentTime : currentTime}
              onChange={handleSeek}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
            />
          </div>
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
