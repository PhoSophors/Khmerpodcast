import React, { useState, useEffect } from "react";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import Login from "../auth/login/Login";
import SideMenu from "../sidemenu/SideMenu";
import AudioControl from "../audio/AudioControl";
import { Drawer } from "antd";
import { useUser } from "../../context/UserContext";
import "./Header.css";
import logo from "../assets/logo.jpg";
import { Avatar, Dropdown, Menu, Alert, Spin, message, Modal } from "antd";
import {
  MenuOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CloseOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { getIcon } from "../sidemenu/iconUtils";
import { useTranslation } from "react-i18next";

const Header = ({ handleCollapse, onSelectMenuItem }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
  const [menuVisible, setMenuVisible] = useState(false);
  const { user, isLoading, isLoggedIn, handleConfirmLogout } = useUser();
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "default"
  );
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { t } = useTranslation();

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

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const menu = (
    <Menu style={{ width: "250px" }} className="profile-dropdown-menu">
      <Menu.Item>
        <LanguageSwitcher />
      </Menu.Item>
      <Menu.Item onClick={handleLogout} icon={getIcon("/logout")}>
        <span>{t("siderMenu.logout")}</span>
      </Menu.Item>
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
      <div
        onClick={handleMenuClick}
        className="header-toggle-bg p-1 cursor-pointer h-full flex justify-center items-center rounded-full"
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
                  <span className="name-style  tracking-wide text-sm text-slate-700 dark:text-slate-100  font-semibold">
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
                <div className="username-header cursor-pointer uppercase capitalize tracking-wide text-sm text-indigo-500 font-semibold">
                  {user && user.username.split(" ")[0]}
                </div>
                &nbsp;
                <DownOutlined
                  className="text-indigo-500"
                  style={{ fontSize: "10px" }}
                />
                &nbsp;
                <Avatar
                  className="avatar"
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
