import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, Spin } from "antd";
import { PlayCircleFilled, PauseCircleFilled } from "@ant-design/icons";
import PodcastPlayer from "../songsPlayer/PodcastPlayer";

const CustomCard = ({ index, hoveredIndex, setHoveredIndex }) => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [audioUrls, setAudioUrls] = useState([]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentAudioElement, setCurrentAudioElement] = useState(null);
  const audioRef = useRef(null);
  const [notification, setNotification] = useState(null);
  
  const [currentAudio, setCurrentAudio] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/upload");
      setFiles(response.data);
      const urls = response.data.map((file) => file.audio.url);
      setAudioUrls(urls);
    } catch (error) {
      console.error("Error fetching files:", error.message);
      setNotification("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };

  const handleAudioChange = (audioUrl, clickedIndex) => {
    if (currentPlayingIndex === clickedIndex) {
      toggleAudio();
    } else {
      if (currentAudioElement) {
        currentAudioElement.pause();
      }
      setCurrentAudioElement(audioRef.current);
      setCurrentAudio(audioUrl);
      setAudioPlaying(true);
      setShowPlayer(true);
      setCurrentPlayingIndex(clickedIndex);
    }
  };

  const handleCardClick = () => {
    setShowPlayer(!showPlayer); // Toggle showPlayer state for the clicked card
    setCurrentPlayingIndex(null); // Reset the current playing index when a card is clicked
  };

  return (
    <div 
      className="sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/6 w-1/2 p-2"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <Card
        hoverable
        style={{
          borderRadius: "20px",
          boxShadow: "0 20px 37.6px rgba(0,0,0,0.090)",
          border: "none",
        }}
        cover={
          <div
            style={{
              padding: "10px",
              position: "relative",
              aspectRatio: "1/1",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading && (
              <div
                className="loading-spinner"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.5)",
                  zIndex: 1,
                }}
              >
                <Spin />
              </div>
            )}
            <img
              className="w-full h-full object-cover"
              alt={`example-${index}`}
              src={files[index]?.image?.url}
              onLoad={handleImageLoad}
              style={{ borderRadius: "10px" }}
            />
            {(hoveredIndex === index || window.innerWidth <= 768) && (
              <div
                className="play-icon"
                style={{
                  position: "absolute",
                  bottom: "15px",
                  right: "15px",
                  zIndex: 2,
                }}
              >
                {audioPlaying ? (
                  <PauseCircleFilled
                    style={{ fontSize: "2.5rem", color: "#4f46e5" }}
                    onClick={toggleAudio}
                  />
                ) : (
                  <PlayCircleFilled
                    style={{ fontSize: "2.5rem", color: "#4f46e5" }}
                    onClick={() => handleAudioChange(files[index]?.audio?.url, index)}
                  />
                )}
              </div>
            )}
          </div>
        }
        onClick={handleCardClick} // Add onClick event to toggle showPlayer state for this card
      >
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: "-20px 0px 5px",
          }}
        >
          <div className="tracking-wide text-sm text-indigo-500 font-semibold">
            {files[index]?.title}
          </div>
          <p className="mt-2 text-slate-500">{files[index]?.description}</p>
        </div>
      </Card>
      <audio ref={audioRef} src={currentAudio} />

      {/* if click play is popup PodcastPlayer and click new play it remove old and popup new play */}

      {showPlayer && (
        <PodcastPlayer
          src={currentAudio}
          isPlaying={audioPlaying}
          handlePlayPause={toggleAudio}
        />
      )}
    </div>
  );
};

export default CustomCard;
