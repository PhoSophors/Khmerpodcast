import React, { useState } from "react";
import { Spin, Card } from "antd";
import { useAudio } from "../../context/AudioContext";
import "./card.css";
import {
  PauseCircleFilled,
  PlayCircleFilled,
  MoreOutlined,
} from "@ant-design/icons";

const UserUploadCard = ({ file, setSelectedPodcast }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { isPlaying, currentTrack, setIsPlaying, setCurrentTrack, audioRef } =
    useAudio();

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const toggleAudio = () => {
    // if (isMobile || isHovered) {
    if (currentTrack === file.audio.url) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(file.audio.url);
      setIsPlaying(true);
    }
    // }
  };

  const handleViewDetailPodcast = () => {
    setSelectedPodcast(file);
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
                  className="object-cover"
                  src={file.image.url}
                  alt={`.${file._id} hidden`}
                  onLoad={handleImageLoad}
                  style={{
                    borderRadius: "10px",
                    marginRight: "10px",
                    minWidth: "90px",
                    maxHeight: "90px",
                  }}
                />
                {isHovered && (
                  <div
                    className="play-icon"
                    style={{
                      position: "absolute",
                      bottom: "37px",
                      left: "37px",
                      zIndex: 2,
                    }}
                  >
                    {isPlaying && currentTrack === file.audio.url ? (
                      <PauseCircleFilled
                        onClick={toggleAudio}
                        style={{ fontSize: "2rem", color: "#fff" }}
                      />
                    ) : (
                      <PlayCircleFilled
                        onClick={toggleAudio}
                        style={{ fontSize: "2rem", color: "#fff" }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  maxHeight: "95px",
                }}
              >
                <div
                  onClick={handleViewDetailPodcast}
                  className="underline tracking-wide text-sm text-indigo-500 font-semibold"
                >
                  {file.title}
                </div>
                <p className="mt-2 text-slate-500 ">{file.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="items-center">
                <div className="w-24 date-element text-end text-slate-500">
                  {formattedDate}
                </div>
              </div>
              <div className="p-3 text-white  bg-indigo-600 h-8 w-8 flex justify-center items-center rounded-full">
                {/* <Dropdown overlay={shareMenu} trigger={["click"]}> */}
                <MoreOutlined />
                {/* </Dropdown> */}
              </div>
            </div>
          </div>
        }
      />
      <audio ref={audioRef} src={file.audio.url} />
    </div>
  );
};

export default UserUploadCard;
