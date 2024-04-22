import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { PlayCircleFilled, PauseCircleFilled } from "@ant-design/icons";
import { Card, Spin, Dropdown, Menu, message } from "antd";
import {
  MoreOutlined,
  ShareAltOutlined,
  CopyOutlined,
  PlusCircleOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";

const CustomCard = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const [isAddedToFavorites, setIsAddedToFavorites] = useState(() => {
    const cookie = Cookies.get(`favorite-${file._id}`);
    return cookie ? JSON.parse(cookie) : false;
  });

  useEffect(() => {
    Cookies.set(`favorite-${file._id}`, JSON.stringify(isAddedToFavorites));
  }, [isAddedToFavorites, file._id]);

  const handleTogglePodcastInPlaylist = async () => {
    try {
      const authToken = Cookies.get("authToken");
      let response;

      if (isAddedToFavorites) {
        response = await fetch(`/files/remove-favorite/${file._id}`, {
          method: "POST",
          baseUrl: process.env.REACT_APP_PROXY,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        response = await fetch(`/files/favorite/${file._id}`, {
          method: "POST",
          baseUrl: process.env.REACT_APP_PROXY,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Toggle the state after a successful request
      setIsAddedToFavorites(!isAddedToFavorites);
      message.success(
        isAddedToFavorites
          ? "Podcast removed from favorites"
          : "Podcast added to favorites"
      );
    } catch (error) {
      message.error("Error toggling podcast in favorites");
    }
  };

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
              <div className="flex grid sm:grid-cols-2 sm:flex sm:gap-5">
                <div
                  className="play-icon w-full sm:w-1/2"
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    left: "15px",
                    zIndex: 2,
                  }}
                >
                  {audioPlaying ? (
                    <PauseCircleFilled
                      style={{ fontSize: "2rem", color: "#4f46e5" }}
                      onClick={toggleAudio}
                    />
                  ) : (
                    <PlayCircleFilled
                      style={{ fontSize: "2rem", color: "#4f46e5" }}
                      onClick={toggleAudio}
                    />
                  )}
                </div>
                <div
                  className=" w-full sm:w-1/2"
                  style={{
                    position: "absolute",
                    bottom: "17px",
                    right: "-60px",
                    left: "auto",
                    zIndex: 2,
                  }}
                >
                  <div className="p-3 bg-indigo-600 h-8 w-8 flex justify-center items-center rounded-full">
                    <button className="text-white rounded-full">
                      <Dropdown
                        overlay={
                          <Menu style={{ width: "250px" }}>
                            <Menu.Item key="0">
                              <ShareAltOutlined /> Share
                            </Menu.Item>
                            <Menu.Item key="1">
                              <CopyOutlined /> Copy link
                            </Menu.Item>
                            <Menu.Item
                              key="2"
                              onClick={handleTogglePodcastInPlaylist}
                            >
                              {isAddedToFavorites ? (
                                <>
                                  <PlusCircleFilled /> Remove from favorites
                                </>
                              ) : (
                                <>
                                  <PlusCircleOutlined /> Add to favorites
                                </>
                              )}
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["hover"]}
                      >
                        <MoreOutlined />
                      </Dropdown>
                    </button>
                  </div>
                </div>
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
