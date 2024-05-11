import React, { useState } from "react";
import { Spin, Card } from "antd";
import MoreBtn from "../Btn/MoreBtn";
import PlayBtn from "../Btn/PlayBtn";
import DeletePodcastBtn from "../Btn/DeletePodcastBtn";
import "./card.css";


const UserUploadCard = ({ file, handleViewPodcast, userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };


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
                  maxHeight: "95px",
                }}
              >
                <div
                  onClick={handleViewPodcast}
                  className="hover:underline hover:italic cursor-pointer tracking-wide text-sm text-indigo-500 font-semibold"
                >
                  {file.title}
                </div>
                <p className="mt-2 text-slate-500 ">{file.description}</p>
              </div>
            </div>

          
            <div className="flex items-center xl:gap-10 md:gap-10 gap-2">
              <div className="items-center">
                <div className="w-24 date-element text-end text-slate-500">
                  {new Date(file.uploadDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <DeletePodcastBtn file={file} />
              <>
                <MoreBtn file={file} userId={userId}/>
              </>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default UserUploadCard;
