// SideMenu.js
import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import "./SideMenu.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "../assets/logo.jpg";
import { getIcon } from "./iconUtils";

const SideMenu = ({ onSelectMenuItem }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("/");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const id = Cookies.get("id");

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    // const encodedToken = Cookies.get("authToken");
    // const authToken = atob(encodedToken);

    if (authToken) {
      setIsLoading(true);
      // Fetch user data if user is logged in
      axios
        .get(`/auths/user-data/${id}`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const userData = response.data.user;
          if (userData) {
            // Update user data only if valid data is received
            setUser(userData);
            setIsLoggedIn(true);
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching user data:",
            error.response?.data?.message || error.message
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  });

  const handleAppClick = () => {
    window.location.reload();
  };

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem.key);
    onSelectMenuItem(menuItem.key);
  };

  return (
    <div>
      <Menu
        className="side-menu-container"
        mode="inline"
        selectedKeys={[selectedMenuItem]}
        onClick={handleMenuItemClick}
      >
        <div
          onClick={handleAppClick}
          className="flex items-center md:p-4 cursor-pointer"
        >
          <img src={logo} alt="" className="logo-app mr-2" />
          <div className="flex flex-col">
            <span className="uppercase tracking-wide text-xl text-red-600 font-bold">
              Khmer
            </span>
            <span className="uppercase tracking-wide text-sm text-slate-300 font-semibold">
              Podcast
            </span>
          </div>
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
            <Menu.Item
              key="/setting"
              icon={getIcon("/setting", selectedMenuItem)}
            >
              <span onClick={() => handleMenuItemClick({ key: "/setting" })}>
                {t("siderMenu.setting")}
              </span>
            </Menu.Item>
          </>
        )}
      </Menu>
    </div>
  );
};

export default SideMenu;
