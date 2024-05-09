import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spin, message } from "antd";
import PlayBtn from "../../Btn/PlayBtn";
import Cookies from "js-cookie";

const ViewDetailPodcast = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState({});
  const id = Cookies.get("id");

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`/auths/user-data/${id}`, {
        baseURL: process.env.REACT_APP_PROXY,
      });
      return response.data.user;
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data?.message || error.message
      );
    }
  };

  const fetchFile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/files/get-file/${id}`);
      if (response.data) {
        const userDetails = await fetchUserDetails(response.data.user);
        if (userDetails) {
          setUser(userDetails);
        } else {
          message.error("Failed to fetch user details");
        }
      } else {
        message.error("File data not found in response");
      }
    } catch (error) {
      console.error("Error fetching file:", error.message);
      if (error.response && error.response.status === 500) {
        console.error("Server error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10">
        <Spin />
      </div>
    );
  }

  return (
    <div className="p-2 w-full justify-flex-between">
      <Card
        style={{
          height: `calc(100vh - 110px)`,
          backgroundColor: "transparent",
        }}
      >
        <>
          <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5  mx-auto ">
            <div
              className="relative w-full sm:w-1/2 w-fit-content"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {file.image && file.image.url && (
                <img
                  style={{
                    className: "thumbnail-card object-cover",
                    height: "200px",
                    borderRadius: "10px",
                    border: "1px solid #f0f0f0",
                    minWidth: "auto",
                    maxHeight: "20vw",
                  }}
                  src={file.image.url}
                  alt=""
                />
              )}
              {isHovered && (
                <div
                  className="play-icon"
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "80px",
                    zIndex: 2,
                  }}
                >
                  <PlayBtn file={file} />
                </div>
              )}
            </div>
            <div className="w-full col-span-8">
              <h1 className="text-2xl font-semibold text-gray-500  tracking-wide">
                {file.title || ""}
              </h1>
            </div>
          </div>
          <h1>{file.description || ""} </h1>



         

          {file.user && (
            <>
              <p>User ID: {file.user}</p>
              <p>Username: {file.user.username}</p>
              <p>Email: {file.user.email}</p>
            </>
          )}
        </>
      </Card>
    </div>
  );
};

export default ViewDetailPodcast;
