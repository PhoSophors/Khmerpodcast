import React, { useContext } from "react";
import { MoonOutlined, MoonFilled } from "@ant-design/icons";
import ThemeContext from "../../context/ThemeContext";

const Theme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <button
        className="text-indigo-600 dark:text-slate-100 gap-2"
        onClick={toggleTheme}
      >
        <span>Theme</span>
        {theme === "light" ? <MoonOutlined /> : <MoonFilled />}
      </button>
    </div>
  );
};

export default Theme;
