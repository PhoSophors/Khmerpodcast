// SideMenu.js
import React, { useState, useEffect } from "react";
import "./SideMenu.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "../assets/logo.jpg";
import { getIcon } from "./iconUtils";
import { api_url } from "../../api/config";
import { Menu, Modal, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const SideMenu = ({ onSelectMenuItem }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("/");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const authToken = Cookies.get("authToken");
  const id = Cookies.get("id");

  useEffect(() => {
    if (authToken) {
      setIsLoading(true);
      axios
        .get(`${api_url}/auths/user-data/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const userData = response.data.user;
          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
          }
        })
        .catch((error) => {
          message.error("Error fetching user data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [authToken, id]);

  const handleAppClick = () => {
    window.location.reload();
  };

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem.key);
    onSelectMenuItem(menuItem.key);
  };

  //  =================== Logout Modal ===================

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

  const handleLogout = () => {
    // Open the logout confirmation modal
    setLogoutModalVisible(true);
  };

  return (
    <>
      <Menu
        className="side-menu-container "
        mode="inline"
        selectedKeys={[selectedMenuItem]}
        onClick={handleMenuItemClick}
      >
        <div
          onClick={handleAppClick}
          className="flex items-center md:p-4 cursor-pointer"
        >
          {<img src={logo} alt="logo" className="logo-app" />}
          <Menu.Item key="default" className="name-app">
            <span onClick={() => handleMenuItemClick({ key: "default" })}>
              <div className="flex flex-col">
                <span className="uppercase tracking-wide text-xl text-red-600 font-bold">
                  Khmer
                </span>
                <span className="uppercase tracking-wide text-sm text-slate-200 font-semibold">
                  Podcast
                </span>
              </div>
            </span>
          </Menu.Item>
        </div>

        <Menu.Item key="/" icon={getIcon("/", selectedMenuItem)}>
          <span onClick={() => handleMenuItemClick({ key: "/" })}>
            {t("siderMenu.home")}
          </span>
        </Menu.Item>
        <Menu.Item key="/search" icon={getIcon("/search", selectedMenuItem)}>
          <span onClick={() => handleMenuItemClick({ key: "/search" })}>
            {t("siderMenu.search")}
          </span>
        </Menu.Item>
        {isLoggedIn && (
          <>
            <Menu.Item
              key="/favorite"
              icon={getIcon("/favorite", selectedMenuItem)}
            >
              <span onClick={() => handleMenuItemClick({ key: "/favorite" })}>
                {t("siderMenu.favorith")}
              </span>
            </Menu.Item>
            <Menu.Item
              key="/create"
              icon={getIcon("/create", selectedMenuItem)}
            >
              <span onClick={() => handleMenuItemClick({ key: "/create" })}>
                {t("siderMenu.create")}
              </span>
            </Menu.Item>

            {user.role === "admin" && (
              <>
                <Menu.SubMenu
                  key="/admin"
                  icon={getIcon("/all-user")}
                  title={t("siderMenu.admin")}
                >
                  <Menu.Item
                    key="/dashboard"
                    icon={getIcon("/dashboard", selectedMenuItem)}
                  >
                    <span
                      onClick={() => handleMenuItemClick({ key: "/dashboard" })}
                    >
                      {t("siderMenu.dashboard")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="/all-user"
                    icon={getIcon("/all-user", selectedMenuItem)}
                  >
                    <span
                      onClick={() => handleMenuItemClick({ key: "/all-user" })}
                    >
                      {t("siderMenu.allUsers")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    key="/all-user-upload"
                    icon={getIcon("/all-user-upload", selectedMenuItem)}
                  >
                    <span
                      onClick={() =>
                        handleMenuItemClick({ key: "/all-user-upload" })
                      }
                    >
                      {t("siderMenu.fileManager")}
                    </span>
                  </Menu.Item>
                </Menu.SubMenu>
              </>
            )}
          </>
        )}
        {/* Move Profile and Setting items to the bottom */}
        <div style={{ bottom: "0", marginBottom: "auto" }}></div>
        {isLoggedIn && (
          <>
            <Menu.Item key="/profile" icon={getIcon("/profile")}>
              <span onClick={() => handleMenuItemClick({ key: "/profile" })}>
                {t("siderMenu.profile")}
              </span>
            </Menu.Item>
            <Menu.Item onClick={handleLogout} icon={getIcon("/logout")}>
              <span>{t("siderMenu.logout")}</span>
            </Menu.Item>
          </>
        )}
      </Menu>

      <>
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
      </>
    </>
  );
};

export default SideMenu;
