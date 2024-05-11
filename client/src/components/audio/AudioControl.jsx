import React, { useRef, useEffect, useState } from "react";
import {
  StepBackwardFilled,
  StepForwardOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
} from "@ant-design/icons";
import { useAudio } from "../../context/AudioContext";

const AudioControl = () => {
  const audioRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDurationSet, setIsDurationSet] = useState(false);
  const [podcastImage, setPodcastImage] = useState('');
  const {
    isPlaying,
    currentTrack,
    setIsPlaying,
    setCurrentTrack,
    podcasts,
    setCurrentPodcastIndex,
    audioRef: globalAudioRef,
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

  const handleSeekChange = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = e.target.value;
      setCurrentTime(e.target.value);
    }
  };

  const handleLoadedMetadata = () => {
    if (!isDurationSet) {
      setDuration(audioRef.current.duration);
      setIsDurationSet(true);
    }
  };

  const handleDurationChange = () => {
    setDuration(audioRef.current.duration);
  };

  const handlePodcastSelect = (podcast) => {
    // Update the podcastImage state variable when a podcast is selected
    setPodcastImage(podcast.image);
    // alt={`.${file?._id}`}
    // src={file?.image?.url}
  };

  return (
    <div className="p-2 w-auto xl:bg-white md:bg-white bg-slate-100 flex text-center items-center justify-center gap-5 rounded-xl">
      <audio
        ref={audioRef}
        src={currentTrack}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
      />
      <StepBackwardFilled
        onClick={handlePrevious}
        style={{ fontSize: "2rem", color: "#f59e0b" }}
      />
      {isPlaying ? (
        <PauseCircleFilled
          onClick={toggleAudio}
          style={{ fontSize: "2rem", color: "#f59e0b" }}
        />
      ) : (
        <PlayCircleFilled
          onClick={toggleAudio}
          style={{ fontSize: "2rem", color: "#f59e0b" }}
        />
      )}
      <StepForwardOutlined
        onClick={handleNext}
        style={{ fontSize: "2rem", color: "#f59e0b" }}
      />



      {/* <img 
      alt={`.${podcasts?._id}`}
      src={podcasts?.image?.url}
       alt="Podcast" />
      <div className="flex flex-col">
        <span>{podcasts?.title}</span>
        <span>{podcasts?.author}</span>

      </div>
      <span>
        {currentTime}/{duration}
      </span>
      <input
        type="range"
        value={currentTime}
        max={duration}
        onChange={handleSeekChange}
      /> */}

      <input
      className="hidden"
        type="range"
        value={currentTime}
        max={duration}
        onChange={handleSeekChange}
      />
    </div>
  );
};

export default AudioControl;
