import React, { useState } from "react";
import { Card } from "antd";
import PlayBtn from "../Btn/PlayBtn";

const SearchPocastCard = ({ file, handleViewPodcast }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className=" p-1 "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className="card-hover card-bg"
        style={{
          borderRadius: "20px",
          minWidth: "100%",
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
              {isLoading && (
                <div className="custom-card-loading-overlay animate-pulse"></div>
              )}
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
                    <>
                      <PlayBtn file={file} />
                    </>
                  </div>
                )}
              </div>

              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  maxHeight: "90px",
                }}
              >
                <h1
                  onClick={handleViewPodcast}
                  className="hover:underline line-clamp-1 cursor-pointer text-base tracking-wide text-indigo-500 font-semibold"
                >
                  {file.title}
                </h1>

                <h3 className="mt-1 line-clamp-2 text-slate-500 dark:text-gray-300">
                  {file.description}
                </h3>
                <h3 className=" line-clamp-1 text-slate-400 dark:text-gray-400">
                  {file.viewCount} views and {file.playCount} plays
                </h3>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SearchPocastCard;
