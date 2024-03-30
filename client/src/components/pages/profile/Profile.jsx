import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import { UserOutlined, EditOutlined, LoginOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import "./Profile.css"; // Import the CSS file
import { useTranslation } from "react-i18next";
import EditProfile from "./EditProfile";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const Profile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { t } = useTranslation();

  const id = Cookies.get("id");

  useEffect(() => {
    const authToken = Cookies.get("authToken");

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
            setIsLoading(true);
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching user data:",
            error.response?.data?.message || error.message
          );
        });
    }
  }, [id]);

  const handleEditProfile = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  return (
    <div className="profile-container" style={{}}>
      <Card
        style={{ border: "none" }}
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
              <EditOutlined style={{ marginRight: "8px" }} />
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
    </div>
  );
};

export default Profile;
