import React, { useState } from "react";
import { Card } from "antd";
import MoreBtn from "../Btn/MoreBtn";
import PlayBtn from "../Btn/PlayBtn";
import "./card.css";

const FavoritesCard = ({ file, handleViewPodcast }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
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
        className="card-hover card-bg"
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
              {isLoading && (
                <div className="custom-card-loading-overlay animate-pulse"></div>
              )}
              <div>
                <img
                  className="thumnaill-card object-cover"
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
                      bottom: "40px",
                      left: "40px",
                      zIndex: 2,
                    }}
                  >
                    <PlayBtn file={file} />
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
                  onClick={handleViewPodcast}
                  className="hover:underline  cursor-pointer tracking-wide text-sm text-indigo-500 font-semibold"
                >
                  {file.title}
                </div>
                <p className="mt-2 text-slate-500 dark:text-gray-300">
                  {file.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="flex items-center">
                <div className="w-24 date-element text-end text-slate-500 dark:text-gray-300">
                  {formattedDate}
                </div>
              </div>

              <>
                <MoreBtn file={file} />
              </>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default FavoritesCard;
