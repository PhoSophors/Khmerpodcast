import React, { useState, useEffect } from "react";
import { Card, Spin } from "antd";
import MoreBtn from "../Btn/MoreBtn";
import PlayBtn from "../Btn/PlayBtn";

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
    <>
      <div
        className="sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/6 w-1/2 p-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card
          style={{
            borderRadius: "20px",
            boxShadow: "0 20px 37.6px rgba(0,0,0,0.090)",
            // border: "none",
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
                  className="animate-pulse bg-gray-100 rounded-xl w-full h-full object-cover"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(255, 255, 255, 1.5)",
                    zIndex: 1,
                  }}
                >
                  <Spin />
                </div>
              )}
              <>
                <img
                  onClick={handleViewPodcast}
                  className="w-full h-full object-cover cursor-pointer"
                  alt={`.${file?._id}`}
                  src={file?.image?.url}
                  onLoad={handleImageLoad}
                  style={{ borderRadius: "14px", boxSizing: "border-box" }}
                />
              </>
              {(isMobile || isHovered) && (
                <div className="flex grid sm:grid-cols-2 sm:flex sm:gap-5">
                  {!isMobile && (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "15px",
                          right: "15px",
                          zIndex: 2,
                        }}
                      >
                        <PlayBtn file={file} />
                      </div>
                      <div
                        className=" w-full sm:w-1/2"
                        style={{
                          position: "absolute",
                          bottom: "17px",
                          left: "15px",
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
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              margin: "-30px 0px 5px",
            }}
          >
            <div className="mt-1 tracking-wide truncate text-sm text-indigo-500 font-semibold">
              {file.title}
            </div>
            <p className="mt-1 mb-0 truncate text-slate-500">
              {file.description}
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CustomCard;
