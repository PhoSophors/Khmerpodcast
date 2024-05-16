import React, { useState, useEffect } from "react";
import { Card, Button, Spin, message } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";
import UserUploadCard from "../../card/UserUploadCard";
import { Avatar } from "antd";
import "./Profile.css";
import { api_url } from "../../../api/config";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userPodcasts, setUserPodcasts] = useState([]);
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const id = Cookies.get("id");
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    setIsLoading(true);

    if (authToken && id) {
      // Fetch user data if user is logged in
      axios
        .get(`${api_url}/auths/user-data/${id}`, {
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
          message.error(
            "Error fetching user data:",
            error.response?.data?.message || error.message
          );
          setIsError(true);
        });

      // Fetch podcasts uploaded by the user
      axios
        .get(`${api_url}/files/get-file-by-user/${id}`, {
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
          message.error(
            "Error fetching podcasts:",
            error.response?.data?.message || error.message
          );
          setIsError(true);
        });
    }
  }, [authToken, id]);

  return (
    <div className="bg-white h-screen ">
      {isViewPodcast && selectedPodcast ? (
        <ViewDetailPodcast
          file={selectedPodcast}
          handleViewPodcast={() => setIsViewPodcast(false)}
        />
      ) : (
        <div className="flex grid xl:grid-cols-2 grid-cols-1 md:grid-cols-1 md:flex xl:p-2 md:p-2 p-0 xl:gap-2 md:gap-2 gap-2 ">
          <Card className="recent-upload-card">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <div className="profile-content mt-5">
                <Spin spinning={isLoading}>
                  <Avatar
                    size={140}
                    icon={<UserOutlined />}
                    src={userData && userData.profileImage}
                    style={{
                      marginBottom: "16px",
                      border: "1px solid #6366f1",
                    }}
                  />
                </Spin>

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

                <Link to={`/edit-profile/${id}`}>
                  <Button className="mt-10 w-full" size="large">
                    Edit profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="col-span-2 w-full">
            <Card className="profile-card" bodyStyle={{ padding: 0 }}>
              {isLoading || isError ? (
                <div className="spin-container">
                  {/* <Spin size="large" /> */}
                  <p className="font-semibold text-gray-500 uppercase top-0">
                    Not have Podcasts!
                  </p>
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
    </div>
  );
};

export default Profile;
