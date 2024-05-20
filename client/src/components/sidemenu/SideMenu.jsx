// SideMenu.jsx

import React, { useState, useContext } from "react";
import "./SideMenu.css";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.jpg";
import { getIcon } from "./iconUtils";
import { Menu } from "antd";
import { useUser } from "../../services/useUser";
import ThemeContext from "../../context/ThemeContext";

const SideMenu = ({ onSelectMenuItem, collapsed }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("/");
  const { t } = useTranslation();
  const { user, isLoggedIn } = useUser();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleAppClick = () => {
    window.location.reload();
  };

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem.key);
    onSelectMenuItem(menuItem.key);
  };

  return (
    <>
      <Menu
        className="side-menu-container"
        mode="inline"
        selectedKeys={[selectedMenuItem]}
        onClick={handleMenuItemClick}
      >
        <div
          onClick={handleAppClick}
          className={
            "flex items-center md:p-4 cursor-pointer menu-item-wrapper"
          }
        >
          <img src={logo} alt="logo" className="logo-app" />
          {collapsed && (
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
            )}
          </>
        )}
        <div style={{ bottom: "0", marginBottom: "auto" }}></div>
        {isLoggedIn && (
          <>
            <Menu.Item key="/profile" icon={getIcon("/profile")}>
              <span onClick={() => handleMenuItemClick({ key: "/profile" })}>
                {t("siderMenu.profile")}
              </span>
            </Menu.Item>
          </>
        )}

        <Menu.Item
          onClick={toggleTheme}
          key="/theme"
          icon={getIcon("/theme", selectedMenuItem, theme)}
        >
          <span>
            {theme === "light"
              ? t("siderMenu.darkTheme")
              : t("siderMenu.whiteTheme")}
          </span>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default SideMenu;
