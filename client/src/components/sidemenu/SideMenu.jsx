/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Menu, Dropdown, Modal } from "antd";
import "./SideMenu.css";
import logo from "../assets/logo.jpg";
import { getIcon } from "./iconUtils";
import { useUser } from "../../context/UserContext";
import ThemeContext from "../../context/ThemeContext";
import { useLocation } from "react-router-dom";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import {
  CloseOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";

const SideMenu = ({ collapsed }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, isLoggedIn, handleConfirmLogout } = useUser();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "default"
  );

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, [language]);

  const selectedMenuItem = useMemo(
    () => location.pathname,
    [location.pathname]
  );

  const handleAppClick = () => {
    window.location.reload();
  };

  const handleMenuItemClick = (menuItem) => {
    if (menuItem.key === "/dropdown") {
      // Prevent default behavior to keep the dropdown open
      menuItem.domEvent.preventDefault();
    } else {
      // Navigate to the selected menu item
      navigate(menuItem.key);
    }
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
    location.replace("/");
  };

  const moreMenu = (
    <div className="more-menu-container">
      <Menu style={{ width: "300px" }}>
        <Menu.Item>
          <LanguageSwitcher />
        </Menu.Item>
        <Menu.Item key="/theme" onClick={toggleTheme}>
          <span>
            {/* Switch appearance */}
            {theme === "light" ? (
              <>
                <div className="flex gap-2">
                  <SunOutlined />
                  {t("siderMenu.darkTheme")}
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <MoonOutlined />
                  {t("siderMenu.whiteTheme")}
                </div>
              </>
            )}
          </span>
        </Menu.Item>
        {isLoggedIn && (
          <Menu.Item onClick={handleLogout}>
            <div className="flex gap-2">
              <LogoutOutlined />
              <span>{t("siderMenu.logout")}</span>
            </div>
          </Menu.Item>
        )}
        {/* Add more menu items here if needed */}
      </Menu>
    </div>
  );

  return (
    <>
      <Menu
        className="side-menu-container"
        mode="inline"
        selectedKeys={
          selectedMenuItem.includes("/admin")
            ? [selectedMenuItem, "/admin"]
            : [selectedMenuItem]
        }
        onClick={handleMenuItemClick}
      >
        <div
          onClick={handleAppClick}
          className="flex items-center md:p-4 cursor-pointer menu-item-wrapper"
        >
          <img src={logo} alt="logo" className="logo-app" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="uppercase tracking-wide text-xl text-red-600 font-bold">
                Khmer
              </span>
              <span className="uppercase tracking-wide text-sm text-slate-200 font-semibold">
                Podcast
              </span>
            </div>
          )}
        </div>

        <Menu.Item key="/" icon={getIcon("/", selectedMenuItem)}>
          <span>{t("siderMenu.home")}</span>
        </Menu.Item>
        <Menu.Item key="/search" icon={getIcon("/search", selectedMenuItem)}>
          <span>{t("siderMenu.search")}</span>
        </Menu.Item>

        {isLoggedIn && (
          <>
            <Menu.Item
              key="/favorite"
              icon={getIcon("/favorite", selectedMenuItem)}
            >
              <span>{t("siderMenu.favorith")}</span>
            </Menu.Item>
            <Menu.Item
              key="/create"
              icon={getIcon("/create", selectedMenuItem)}
            >
              <span>{t("siderMenu.create")}</span>
            </Menu.Item>

            {/* <Menu.Divider className="divider" /> */}

            {user.role === "admin" && (
              <Menu.SubMenu
                key="/admin"
                icon={getIcon("/all-user")}
                title={t("siderMenu.admin")}
              >
                <Menu.Item
                  key="/dashboard"
                  icon={getIcon("/dashboard", selectedMenuItem)}
                >
                  <span>{t("siderMenu.dashboard")}</span>
                </Menu.Item>
                <Menu.Item
                  key="/all-user"
                  icon={getIcon("/all-user", selectedMenuItem)}
                >
                  <span>{t("siderMenu.allUsers")}</span>
                </Menu.Item>
                <Menu.Item
                  key="/all-user-upload"
                  icon={getIcon("/all-user-upload", selectedMenuItem)}
                >
                  <span>{t("siderMenu.fileManager")}</span>
                </Menu.Item>
              </Menu.SubMenu>
            )}
          </>
        )}
        <div style={{ bottom: "0", marginBottom: "auto" }}></div>
        {isLoggedIn && (
          <>
            <Menu.Item key="/profile" icon={getIcon("/profile")}>
              <span>{t("siderMenu.profile")}</span>
            </Menu.Item>
          </>
        )}

        <Menu.Item key="/dropdown" icon={getIcon("/more")}>
          <Dropdown overlay={moreMenu} trigger={["click"]}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <span>{t("siderMenu.more")}</span>
            </a>
          </Dropdown>
        </Menu.Item>
      </Menu>

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
          <h1 className="text-center text-xl text-indigo-500 dark:text-gray-300 font-semibold mb-4 mt-5">
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
            className="text-slate-600 hover:text-indigo-600 dark:text-gray-300 p-10 font-bold py-2 px-4 rounded-3xl mt-2"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default SideMenu;
