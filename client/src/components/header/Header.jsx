import React, { useState, useEffect } from "react";
import { Avatar, Dropdown, Menu, Alert, Spin, message, Modal } from "antd";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import SearchForm from "../pages/search/SearchForm";
import Login from "../auth/login/Login";
import axios from "axios";
import Cookies from "js-cookie";
import "./Header.css";
import logo from "../assets/logo.jpg";

import {
  MenuOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const Header = ({ handleCollapse, menuOpen, results }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "default"
  );

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    const id = Cookies.get("id");

    if (authToken && id) {
      axios
        .get(`/auths/user-data/${id}`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            "auth-token": authToken,
          },
        })
        .then((response) => {
          setUser(response.data.user);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Error:", error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

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

  const handleLogout = () => {
    // Open the logout confirmation modal
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = () => {
    // Clear user data and cookies
    setUser(null);
    setIsLoggedIn(false);

    Cookies.remove("authToken");
    Cookies.remove("id");

    // Close the logout confirmation modal
    setLogoutModalVisible(false);

    // Refresh the page
    window.location.reload();
  };

  const handleCancelLogout = () => {
    // Close the logout confirmation modal
    setLogoutModalVisible(false);
  };

  const [searchResults, setSearchResults] = useState([]);
  const handleSearchSubmit = async (results) => {
    setSearchResults(results);
  };


  const menu = (
    <Menu style={{ width: "250px" }} className="profile-dropdown-menu">
      <Menu.Item key="0">
        <a href="/">Your Profile</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="/">Settings</a>
      </Menu.Item>
      <Menu.Item key="2">
        <LanguageSwitcher />
      </Menu.Item>
      <Menu.Item key="3" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="header-container">
      <div className="p-3 bg-indigo-800 h-full flex justify-center items-center rounded-full">
        <button
          onClick={handleCollapse}
          className="toggle-button text-white rounded-full"
        >
          {menuOpen ? <MenuOutlined /> : <MenuUnfoldOutlined />}
        </button>
      </div>

      {/* <SearchForm handleSearchSubmit={handleSearchSubmit} /> */}

      <div className="user-profile">
        {isLoading ? (
          // Render a loading spinner or some other placeholder
          <Spin />
        ) : isLoggedIn ? (
          // Render the user's profile dropdown if the user is logged in
          <Dropdown overlay={menu} trigger={["hover"]}>
            <div className=" items-center flex">
              <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {user && user.username}
              </div>
              &nbsp;
              <Avatar
                style={{ cursor: "pointer" }}
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
      <Modal
        visible={logoutModalVisible}
        onCancel={handleCancelLogout}
        footer={null}
        centered
        width={300}
        closeIcon={
          <CloseOutlined className="text-white bg-indigo-600 hover:bg-red-500 rounded-full p-3" />
        }
      >
        <div className="modal-logout mt-10 flex flex-col items-center">
          <img src={logo} alt="" />
          <h1 className="text-center text-xl text-indigo-500 font-semibold mb-4 mt-5">
            Are you sure you want to logout your account?
          </h1>

          <button
            onClick={handleConfirmLogout}
            className="bg-indigo-600 w-32 hover:bg-red-500 text-white p-10 font-bold py-2 px-4 rounded-3xl mt-5"
          >
            Logout
          </button>

          <button
            onClick={handleCancelLogout}
            className="text-slate-600 hover:text-indigo-600 p-10 font-bold py-2 px-4 rounded-3xl mt-2"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
