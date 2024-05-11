import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spin, message, Breadcrumb } from "antd";
import PlayBtn from "../../Btn/PlayBtn";
import MoreBtn from "../../Btn/MoreBtn";
import "./viewpodcast.css";
import Cookies from "js-cookie";
import { api_url } from "../../../api/config";

const ViewDetailPodcast = ({ file, handleViewPodcast }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const authToken = Cookies.get("authToken");

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

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${api_url}/get-file-by-user/${file.userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data) {
        setUser(response.data);
      } else {
        message.error("User data not found in response");
      }
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  useEffect(() => {
    fetchFile();
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <Spin />
      </div>
    );
  }

  return (
    <div className=" min-w-full ">
      <Card className="view-podcast-card">
        <Breadcrumb className="w-full bg-slate-100 p-3 rounded-xl cursor-pointer">
          <Breadcrumb.Item onClick={handleViewPodcast}>
            {/* <ArrowLeftOutlined /> Back */}
            Back
          </Breadcrumb.Item>
          <Breadcrumb.Item>View Podcast</Breadcrumb.Item>
        </Breadcrumb>

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
                        marginRight: "-10px",
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
                    <div className=" mx-3 tracking-wide mt-5 play-and-more-btn-laptop text-xl text-indigo-500 font-semibold">
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

        {user && (
          <div>
            {user._id}
            <h2> name{user.username}</h2>
            <p> email {user.email}</p>
            {/* Display other user information here */}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ViewDetailPodcast;
