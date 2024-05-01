import React, { useState, useRef } from "react";
import { Spin, Card, message } from "antd"; // Import Button and message from antd
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  PauseCircleFilled,
  PlayCircleFilled,
  MoreOutlined,
} from "@ant-design/icons";

const FavoritesCard = ({ file, setSelectedPodcast }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const handleImageLoad = () => {
    setIsLoading(false);
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
    setSelectedPodcast(file);
  };
  

  const removePodcastFromFavorites = async () => {
    const authToken = Cookies.get("authToken");

    try {
      let response;

      response = await fetch(`/files/remove-favorite/${file._id}`, {
        method: "POST",
        baseUrl: process.env.REACT_APP_PROXY,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        message.success("Podcast removed from favorites");
      } else {
        throw new Error("Failed to remove podcast from favorites");
      }
    } catch (error) {
      message.error("Error remove podcast in favorites");
    }
  };

  const date = new Date(); // replace this with your date
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="w-full p-1 justify-flex-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        style={{
          borderRadius: "20px",
          // border: "none",
        }}
        bodyStyle={{ padding: 0 }}
        cover={
          <div
            style={{
              padding: "10px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              {isLoading && <Spin />}
              <div>
                <img
                  className="h-28 object-cover"
                  src={file.image.url}
                  alt={`.${file._id} hidden`}
                  onLoad={handleImageLoad}
                  style={{ borderRadius: "10px", marginRight: "10px" }}
                />
                {isHovered && (
                  <div
                    className="play-icon"
                    style={{
                      position: "absolute",
                      bottom: "45px",
                      left: "45px",
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

              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "70%",
                  maxHeight: "95px",
                }}
              >
                <div
                  onClick={handleViewDetailPodcast}
                  className="tracking-wide text-sm text-indigo-500 font-semibold"
                >
                  {file.title}
                </div>
                <p className="mt-2 text-slate-500 ">{file.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="flex items-center">
                <div className=" text-slate-500">{formattedDate}</div>
              </div>

              <div
                onClick={removePodcastFromFavorites}
                className="cursor-pointer"
              >
                <svg
                  className="w-4 h-4 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 14 20"
                >
                  <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z" />
                </svg>
              </div>
              <div>
                <MoreOutlined />
              </div>
            </div>
          </div>
        }
      />
      <audio ref={audioRef} src={file.audio.url} />
    </div>
  );
};

export default FavoritesCard;
