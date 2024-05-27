import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "antd";
import "./SideMenu.css";
import logo from "../assets/logo.jpg";
import { getIcon } from "./iconUtils";
import ThemeContext from "../../context/ThemeContext";

const SideMenu = ({ collapsed, user, isLoggedIn }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const selectedMenuItem = useMemo(() => location.pathname, [location.pathname]);

  const handleAppClick = () => {
    window.location.reload();
  };

  const handleMenuItemClick = (menuItem) => {
    navigate(menuItem.key);
  };

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
          <span>{t("siderMenu.home")}</span>
        </Menu.Item>
        <Menu.Item key="/search" icon={getIcon("/search", selectedMenuItem)}>
          <span>{t("siderMenu.search")}</span>
        </Menu.Item>

        {isLoggedIn && (
          <>
            <Menu.Item key="/favorite" icon={getIcon("/favorite", selectedMenuItem)}>
              <span>{t("siderMenu.favorith")}</span>
            </Menu.Item>
            <Menu.Item key="/create" icon={getIcon("/create", selectedMenuItem)}>
              <span>{t("siderMenu.create")}</span>
            </Menu.Item>

            <Menu.Divider className="divider" />

            {user.role === "admin" && (
              <Menu.SubMenu
                key="/admin"
                icon={getIcon("/all-user")}
                title={t("siderMenu.admin")}
              >
                <Menu.Item key="/dashboard" icon={getIcon("/dashboard", selectedMenuItem)}>
                  <span>{t("siderMenu.dashboard")}</span>
                </Menu.Item>
                <Menu.Item key="/all-user" icon={getIcon("/all-user", selectedMenuItem)}>
                  <span>{t("siderMenu.allUsers")}</span>
                </Menu.Item>
                <Menu.Item key="/all-user-upload" icon={getIcon("/all-user-upload", selectedMenuItem)}>
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

        <Menu.Item onClick={toggleTheme} key="/theme" icon={getIcon("/theme", selectedMenuItem, theme)}>
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
