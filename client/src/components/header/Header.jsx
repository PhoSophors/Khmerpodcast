import React, { useState, useEffect } from "react";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import Login from "../auth/login/Login";
import axios from "axios";
import Cookies from "js-cookie";
import "./Header.css";
import { api_url } from "../../api/config";
import logo from "../assets/logo.jpg";
import { Avatar, Dropdown, Menu, Alert, Spin, message } from "antd";
import {
  MenuOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  // CloseOutlined,
  // LogoutOutlined,
} from "@ant-design/icons";
import SideMenu from "../sidemenu/SideMenu";
import AudioControl from "../audio/AudioControl";
import { Drawer } from "antd";

const Header = ({ handleCollapse, onSelectMenuItem }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
  const [menuVisible, setMenuVisible] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "default"
  );
  const authToken = Cookies.get("authToken");
  const id = Cookies.get("id");

  useEffect(() => {
    if (authToken && id) {
      axios
        .get(`${api_url}/auths/user-data/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          // message.error("Error fetching user data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [authToken, id]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, [language]);

  const handleLoginModalCancel = () => {
    setLoginModalVisible(false);
  };

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true);
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

  const menu = (
    <Menu style={{ width: "250px" }} className="profile-dropdown-menu">
      <Menu.Item key="2">
        <LanguageSwitcher />
      </Menu.Item>
      {/* <Menu.Item key="3">
        <LogoutOutlined /> Logout
      </Menu.Item> */}
    </Menu>
  );

  const mobileMenu = <Menu onClick={handleMenuItemClick} />;

  const handleMenuClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleAppClick = () => {
    window.location.reload();
  };

  return (
    <header className="header-container">
      <div className="p-1 bg-slate-100 h-full flex justify-center items-center rounded-full">
        <div className="p-3 bg-indigo-600 h-full flex justify-center items-center rounded-full">
          {isMobileDevice ? (
            <div onClick={handleMenuClick}>
              {menuVisible ? (
                <MenuUnfoldOutlined className="text-white cursor-pointer" />
              ) : (
                <MenuOutlined className="text-white cursor-pointer" />
              )}
              {menuVisible && mobileMenu}
            </div>
          ) : (
            <button
              onClick={handleCollapse} // Ensure this invokes the handleCollapse function
              className="toggle-button text-white rounded-full"
            >
              <MenuOutlined />
            </button>
          )}
          <Drawer
            className="drawer"
            title={
              <div
                onClick={handleAppClick}
                className="title-drawer cursor-pointer"
              >
                <img
                  className=""
                  src={logo}
                  alt=""
                  style={{ height: "70px" }}
                />
                <div className=" flex flex-col ">
                  <span className="name-style tracking-wide text-xl text-red-600 font-bold">
                    Khmer
                  </span>
                  <span className="name-style  tracking-wide text-sm text-slate-200 font-semibold">
                    Podcast
                  </span>
                </div>
              </div>
            }
            placement="right"
            closable={false}
            onClose={handleMenuClick}
            visible={menuVisible}
            style={{
              width: "300px",
              backgroundColor: "#f8fafc",
              height: "100%",
            }}
          >
            <SideMenu onSelectMenuItem={onSelectMenuItem} />
          </Drawer>
        </div>
        <div className="p-3 bg-slate-100 h-full flex justify-center items-center rounded-full">
          <LanguageSwitcher />
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
            // Render the user's profile dropdown if the user is logged in
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className=" items-center flex">
                <div class="uppercase capitalize tracking-wide text-sm text-indigo-500 font-semibold">
                  {user && user.username}
                </div>
                &nbsp;
                <Avatar
                  src={user && user.profileImage}
                  style={{ cursor: "pointer", border: "1px solid #6366f1" }}
                  size="large"
                  icon={<UserOutlined />}
                />
              </div>
            </Dropdown>
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
      {/* Logout confirmation modal */}
    </header>
  );
};

export default Header;
