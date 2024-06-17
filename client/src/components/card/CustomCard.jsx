import React, { useState, useEffect } from "react";
import { Card } from "antd";
import MoreBtn from "../Btn/MoreBtn";
import PlayBtn from "../Btn/PlayBtn";
import "./card.css";

const CustomCard = ({ file, handleViewPodcast }) => {
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleImageLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/6 w-1/2 p-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {loading && (
          <div className="custom-card-loading-overlay animate-pulse " />
        )}

        <Card
          className="card-bg custom-card "
          cover={
            <div className="relative">
              <img
                onClick={handleViewPodcast}
                className="w-full h-full object-cover cursor-pointer"
                alt={`.${file?._id}`}
                src={file?.image?.url}
                onLoad={handleImageLoad}
                style={{
                  borderRadius: "14px",
                  boxSizing: "border-box",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              />
              {(isMobile || isHovered) && (
                <div className="flex grid sm:grid-cols-2 sm:flex sm:gap-5">
                  {!isMobile && (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "5px",
                          right: "5px",
                          zIndex: 2,
                        }}
                      >
                        <PlayBtn file={file} />
                      </div>
                      <div
                        className="w-full sm:w-1/2"
                        style={{
                          position: "absolute",
                          bottom: "7px",
                          left: "5px",
                          zIndex: 2,
                        }}
                      >
                        <MoreBtn file={file} />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          }
        >
          <div>
            <h3 className="mt-1 tracking-wide truncate text-indigo-500 font-semibold">
              {file.title}
            </h3>
            <h3 className="mt-1 mb-0 truncate text-slate-500 dark:text-gray-300">
              {file.description}
            </h3>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomCard;
