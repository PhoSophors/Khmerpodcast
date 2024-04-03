// SideMenu.js
import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import "./SideMenu.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "../assets/logo.jpg";
import {
  HeartOutlined,
  HomeOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
  HomeFilled,
  SettingFilled,
  HeartFilled,
  PlusCircleOutlined,
  PlusCircleFilled,
  DashboardOutlined,
  DashboardFilled,
} from "@ant-design/icons";

const SideMenu = ({ onSelectMenuItem }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("/");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const id = Cookies.get("id");

  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (authToken) {
      setIsLoading(true);
      // Fetch user data if user is logged in
      axios
        .get(`/auths/user-data/${id}`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            "auth-token": authToken,
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
  }, []);

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem.key);
    onSelectMenuItem(menuItem.key);
  };

  const handleAppClick = () => {
    window.location.reload();
  };

  const iconMapping = {
    "/": { selected: <HomeFilled />, default: <HomeOutlined /> },
    "/search": { selected: <SearchOutlined />, default: <SearchOutlined /> },
    "/favorite": { selected: <HeartFilled />, default: <HeartOutlined /> },
    "/create": {
      selected: <PlusCircleFilled />,
      default: <PlusCircleOutlined />,
    },
    "/setting": { selected: <SettingFilled />, default: <SettingOutlined /> },
    "/profile": { selected: <UserOutlined />, default: <UserOutlined /> },
    "/dashboard": {
      selected: <DashboardFilled />,
      default: <DashboardOutlined />,
    },
  };

  const getIcon = (key) => {
    const icon = iconMapping[key];
    return icon
      ? selectedMenuItem === key
        ? icon.selected
        : icon.default
      : null;
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
          className="flex items-center p-4 cursor-pointer"
        >
          <img src={logo} alt="" className="logo-app mr-2" />
          {/* <div className="flex flex-col">
            <span className="uppercase tracking-wide text-xl text-red-600 font-bold">
              Khmer
            </span>
            <span className="uppercase tracking-wide text-sm text-slate-300 font-semibold">
              Podcast
            </span>
          </div> */}
        </div>

        <Menu.Item key="/" icon={getIcon("/")}>
          <span onClick={() => handleMenuItemClick({ key: "/" })}>
            {t("siderMenu.home")}
          </span>
        </Menu.Item>
        <Menu.Item key="/search" icon={getIcon("/search")}>
          <span onClick={() => handleMenuItemClick({ key: "/search" })}>
            {t("siderMenu.search")}
          </span>
        </Menu.Item>
        {isLoggedIn && (
          <>
            <Menu.Item key="/favorite" icon={getIcon("/favorite")}>
              <span onClick={() => handleMenuItemClick({ key: "/favorite" })}>
                {t("siderMenu.favorith")}
              </span>
            </Menu.Item>
            <Menu.Item key="/create" icon={getIcon("/create")}>
              <span onClick={() => handleMenuItemClick({ key: "/create" })}>
                {t("siderMenu.create")}
              </span>
            </Menu.Item>

            {user.role === "admin" && (
              <Menu.Item key="/dashboard" icon={getIcon("/dashboard")}>
                <span
                  onClick={() => handleMenuItemClick({ key: "/dashboard" })}
                >
                  {t("siderMenu.dashboard")}
                </span>
              </Menu.Item>
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
            <Menu.Item key="/setting" icon={getIcon("/setting")}>
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
