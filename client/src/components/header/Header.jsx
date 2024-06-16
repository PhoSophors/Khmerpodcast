import React, { useState } from "react";
import Login from "../auth/login/Login";
import SideMenu from "../sidemenu/SideMenu";
import AudioControl from "../audio/AudioControl";
import { useUser } from "../../context/UserContext";
import "./Header.css";
import logo from "../assets/logo.jpg";
import { Avatar, Menu, Alert, Spin, message, Drawer } from "antd";
import {
  MenuOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ onSelectMenuItem, handleCollapse }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
  const [menuVisible, setMenuVisible] = useState(false);
  const { user, isLoading, isLoggedIn } = useUser();
const navigate = useNavigate();

  const handleLoginModalCancel = () => {
    setLoginModalVisible(false);
  };

  const handleSuccessfulLogin = () => {
    setShowSuccessAlert(true);

    message.success("Login successful");

    // Hide the success alert after a few seconds
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  const handleMenuItemClick = (e) => {
    onSelectMenuItem(e);
    handleMenuClick();
  };

  const mobileMenu = <Menu onClick={handleMenuItemClick} />;

  const handleMenuClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleAppClick = () => {
    navigate("/");
  };

  return (
    <header className="header-container ">
      <div
        onClick={handleMenuClick}
        className="header-toggle-bg backdrop-blur-sm bg-white/30  p-1 cursor-pointer h-full flex justify-center items-center rounded-full"
      >
        <div
          onClick={handleCollapse}
          className="p-3 bg-indigo-600 h-full flex justify-center items-center rounded-full"
        >
          {isMobileDevice ? (
            <>
              {menuVisible ? (
                <MenuUnfoldOutlined className="text-white cursor-pointer" />
              ) : (
                <MenuOutlined className="text-white cursor-pointer" />
              )}
              {menuVisible && mobileMenu}
            </>
          ) : (
            <button className="toggle-button text-white rounded-full">
              <MenuOutlined />
            </button>
          )}

          <Drawer
            className="drawer"
            visible={menuVisible}
            closeIcon={null}
            title={
              <div
                onClick={handleAppClick}
                className="title-drawer cursor-pointer gap-3"
              >
                <img
                  src={logo}
                  alt=""
                  style={{
                    height: "6vh",
                    border: "1px solid #6366f1",
                    borderRadius: "10px",
                  }}
                />
                <div className=" flex flex-col ">
                  <span className="name-style tracking-wide text-2xl text-indigo-600 dark:text-slate-100 font-bold">
                    Khmer
                  </span>
                  <span className="name-style  tracking-wide text-sm text-slate-700 dark:text-slate-100  font-semibold">
                    Podcast
                  </span>
                </div>
              </div>
            }
          >
            <SideMenu onSelectMenuItem={handleMenuItemClick} />
          </Drawer>
        </div>
      </div>

      <div className="audio-control">
        <AudioControl />
      </div>

      {/* flex-row-reverse */}
      <div className="flex gap-3">
        <div className="user-profile">
          {isLoading ? (
            // Render a loading spinner or some other placeholder
            <Spin />
          ) : isLoggedIn ? (
            // Render the user's profile if the user is logged in
            <div className=" items-center flex">
              {/* <span className="username-header font-semibold uppercase  tracking-wide text-sm text-indigo-500 font-semibold">
                {user &&
                  (user.username.split(" ")[0].length > 5
                    ? user.username.split(" ")[0].slice(0, 5) + "..."
                    : user.username.split(" ")[0])}
              </span> */}
              &nbsp;
              <Link to="/profile">
                <Avatar
                  className="avatar cursor-pointer"
                  src={user && user.profileImage}
                  style={{ border: "1px solid #6366f1" }}
                  size="large"
                  icon={<UserOutlined />}
                />
              </Link>
            </div>
          ) : (
            // Render the login button if the user is not logged in
            <button
              onClick={() => setLoginModalVisible(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-10 font-bold py-2 px-4 rounded-3xl"
            >
              Login
            </button>
          )}
          {loginModalVisible && (
            <Login
              visible={loginModalVisible}
              onCancel={handleLoginModalCancel}
              onSuccess={handleSuccessfulLogin}
            />
          )}
        </div>
      </div>

      {/* Render the success alert when showSuccessAlert is true */}
      {showSuccessAlert && (
        <Alert
          message="Login Successful"
          type="success"
          showIcon
          style={{ margin: "0 16px" }}
        />
      )}
    </header>
  );
};

export default Header;
