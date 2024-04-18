import React, { useState, useRef } from "react";
import { Card, Spin } from "antd";
import { PlayCircleFilled, PauseCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CustomCard = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleImageLoad = () => {
    setLoading(false);
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
    if (audioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleViewDetailPodcast = () => {
    navigate(`/view-detail-podcast/${file._id}`);
  };

  if (!file) {
    return null; 
  }

  return (
    <div
      className="sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/6 w-1/2 p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
              onClick={handleViewDetailPodcast}
              className="w-full h-full object-cover"
              alt={`.${file._id} hidden`}
              src={file.image.url}
              onLoad={handleImageLoad}
              style={{ borderRadius: "10px" }}
            />

            {isHovered && (
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
                    onClick={toggleAudio}
                  />
                )}
              </div>
            )}
          </div>
        }
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
            {file.title}
          </div>
          <p className="mt-2 text-slate-500">{file.description}</p>
        </div>
      </Card>
      <audio ref={audioRef} src={file.audio.url} />
    </div>
  );
};

export default CustomCard;
