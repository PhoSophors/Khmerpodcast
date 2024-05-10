import React, { useState, useEffect } from "react";
import { Card, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";
import UserUploadCard from "../../card/UserUploadCard";
import { Avatar } from "antd";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userPodcasts, setUserPodcasts] = useState([]);
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const id = Cookies.get("id");

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    setIsLoading(true);

    if (authToken && id) {
      // Fetch user data if user is logged in
      axios
        .get(`/auths/user-data/${id}`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const user = response.data.user;
          if (user) {
            // Update user data only if valid data is received
            setUserData(user);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching user data:",
            error.response?.data?.message || error.message
          );
          setIsError(true);
        });

      // Fetch podcasts uploaded by the user
      axios
        .get(`/files/get-file-by-user/${id}`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const podcasts = response.data.reverse();
          if (podcasts) {
            // Update podcasts data only if valid data is received
            setUserPodcasts(podcasts);
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching podcasts:",
            error.response?.data?.message || error.message
          );
          setIsError(true);
        });
    }
  }, [id]);

  return (
    <>
      {isViewPodcast && selectedPodcast ? (
        <ViewDetailPodcast
          file={selectedPodcast}
          handleViewPodcast={() => setIsViewPodcast(false)}
        />
      ) : (
        <div className="flex grid xl:grid-cols-2 grid-cols-1 md:grid-cols-1 gap-2 sm:flex sm:gap-5 p-2">
          <Card title="Profile">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <div className="profile-content mt-5">
                <Avatar
                  size={140}
                  icon={<UserOutlined />}
                  src={userData && userData.profileImage}
                  style={{ marginBottom: "16px" }}
                />

                <h1 className="text-2xl text-center text-gray-600 font-bold ">
                  {userData && userData.username}
                </h1>

                <div className="mt-5  rounded-xl p-3 relative border w-full">
                  <h1 className="text-gray-500 mt- mx-7 text-center text-lg">
                    {userData && userData.email}
                  </h1>
                  <span
                    className="text-gray-500 bg-white absolute "
                    style={{
                      top: "-10px",
                      padding: "0 5px",
                    }}
                  >
                    Email *
                  </span>
                </div>

                <div className="mt-5  rounded-xl p-3 relative border w-full">
                  <h1 className="text-gray-500 mt- mx-7 text-center text-lg">
                    {userData && userData.role}
                  </h1>
                  <span
                    className="text-gray-500 bg-white absolute "
                    style={{
                      top: "-10px",
                      padding: "0 5px",
                    }}
                  >
                    Role *
                  </span>
                </div>

                <Link  to={`/edit-profile/${id}`}>
                  <Button className="mt-10 w-full" size="large">
                    Edit profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="col-span-2 w-full">
            <Card title="Recent Podcasts">
              {isLoading || isError ? (
                <div className="spin-container">
                  <Spin size="large" />
                </div>
              ) : (
                <div className="flex sm:p-0 md:p-0 xl:p-0 xl:p-5 flex-wrap justify-center items-center">
                  {userPodcasts.map((file, index) => (
                    <UserUploadCard
                      key={file.id}
                      file={file}
                      handleViewPodcast={() => {
                        setIsViewPodcast(true);
                        setSelectedPodcast(file);
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
