import React, { useState, useEffect } from "react";
import { Card, Button, Spin } from "antd";
import { UserOutlined, LoginOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import "./Profile.css"; // Import the CSS file
import { useTranslation } from "react-i18next";
import EditProfile from "./EditProfile";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import CustomCard from "../../card/CustomCard";

const Profile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userPodcasts, setUserPodcasts] = useState([]);
  const { t } = useTranslation();

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
            "auth-token": authToken,
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
        });

      // Fetch podcasts uploaded by the user
      axios
        .get(`/files/get-file-by-user/${id}`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            "auth-token": authToken,
          },
        })
        .then((response) => {
          const podcasts = response.data;
          if (podcasts) {
            // Update podcasts data only if valid data is received
            setUserPodcasts(podcasts);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching podcasts:",
            error.response?.data?.message || error.message
          );
        });
    }
  }, [id]);

  const handleEditProfile = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  return (
    <div className="profile-container p-5 ">
      <Card
        style={{ backgroundColor: "transparent" }}
        title={
          <span>
            <UserOutlined style={{ marginRight: "8px" }} />
            {isEditingProfile
              ? t("profile.editProfileTitle")
              : t("profile.title")}
          </span>
        }
      >
        {isEditingProfile ? (
          <EditProfile user={userData} />
        ) : userData ? (
          <div className="profile-content">
            <Avatar
              size={140}
              // src={userData.photoURL}
              icon={<UserOutlined />}
              style={{ marginBottom: "16px" }}
            />

            <h1
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              {userData.username}
            </h1>

            <Button
              className="edit-button"
              size="large"
              onClick={handleEditProfile}
            >
              {/* <EditOutlined style={{ marginRight: "8px" }} /> */}
              Edit profile
            </Button>
            <p className="hidden">User Token: </p>
          </div>
        ) : (
          <div className="profile-content">
            <Avatar
              size={140}
              icon={<UserOutlined />}
              style={{ marginBottom: "16px" }}
            />

            <Link to="/login">
              <Button className="edit-button" size="large">
                <LoginOutlined style={{ marginRight: "8px" }} />
                Login
              </Button>
            </Link>
          </div>
        )}
      </Card>
      {/* get all files in here */}
      {isLoading || isError ? (
        <div className="spin-container">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="flex  sm:p-0 md:p-0 xl:p-0 xl:p-5 flex-wrap justify-center items-center">
            {userPodcasts.map((podcast, index) => (
              <CustomCard key={index} file={podcast} />
            ))}
          </div>
        </>
      )}
      {/* <div className="flex  sm:p-0 md:p-0 xl:p-0 xl:p-5 flex-wrap justify-center items-center">
          {userPodcasts.map((podcast, index) => (
            <CustomCard key={index} file={podcast} />
          ))}
        </div> */}
    </div>
  );
};

export default Profile;
