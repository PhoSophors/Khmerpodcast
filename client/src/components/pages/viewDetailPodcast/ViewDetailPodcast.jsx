import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spin, message, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PlayBtn from "../../Btn/PlayBtn";
import MoreBtn from "../../Btn/MoreBtn";
import "./viewpodcast.css";

const ViewDetailPodcast = ({ file, handleViewPodcast }) => {
  const [loading, setLoading] = useState(true);

  const fetchFile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/files/get-file/${file._id}`);
      if (response.data) {
        setLoading(false);
      } else {
        message.error("File data not found in response");
      }
    } catch (error) {
      console.error("Error fetching file:", error.message);
      if (error.response && error.response.status === 500) {
        console.error("Server error:", error.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [file._id]);

  if (loading) {
    return (
      <div className="p-10">
        <Spin />
      </div>
    );
  }

  return (
    <div className="p-1 min-w-full min-h-100">
      <Card
        style={{
          height: "100%",
          // backgroundColor: "transparent",
          // border: "none",
        }}
      >
        <div
          onClick={handleViewPodcast}
          className="p-3 mx-2 cursor-pointer  text-white bg-indigo-600   h-8 w-8 flex justify-center items-center rounded-full"
        >
          <ArrowLeftOutlined />
        </div>

        <div className="w-full container-view-podcast mt-5">
          <Card
            style={{
              border: "none",
              backgroundColor: "transparent",
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
                  <div>
                    <img
                      className="object-cover image-view-podcast"
                      src={file.image.url}
                      alt={`.${file._id} hidden`}
                      style={{
                        borderRadius: "10px",
                        marginRight: "10px",
                        minWidth: "15vw",
                        maxHeight: "15vw",
                        justifyContent: "center",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                      maxHeight: "95px",
                    }}
                  >
                    <div className="tracking-wide mt-5 play-and-more-btn-laptop text-xl text-indigo-500 font-semibold">
                      {file.title}
                    </div>
                  </div>
                </div>

                <div className=" flex justify-end mt-2 items-center gap-3">
                  <div className="play-and-more-btn-laptop">
                    <PlayBtn file={file} />
                  </div>
                  <div className="play-and-more-btn-laptop">
                    <MoreBtn file={file} />
                  </div>
                </div>
              </div>
            }
          />
        </div>

        <div className="justify-flex-between play-and-more-btn-mobile gap-3 mt-5">
          <div className="tracking-wide text-xl text-start w-4/5 text-indigo-500 font-semibold">
            {file.title}
          </div>

          <div className="flex  justify-end mt-2 items-center gap-3">
            <div>
              <PlayBtn file={file} />
            </div>
            <div>
              <MoreBtn file={file} />
            </div>
          </div>
        </div>

        <hr className="mt-5 mb-5" />
        <p className="mt-2 text-slate-500 xl:w-6/12 md:w-6/12 w-full">
          {file.description}
        </p>
        <hr className="mt-5 mb-5" />
        {file.user && (
          <>
            <p className="">User ID: {file.user}</p>
            <p>Username: {file.user.username}</p>
          </>
        )}
      </Card>
    </div>
  );
};

export default ViewDetailPodcast;
