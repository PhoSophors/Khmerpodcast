import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon as solidMoon } from "@fortawesome/free-solid-svg-icons";
import { faSun as solidSun } from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../../context/ThemeContext";

const Theme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <button onClick={toggleTheme} className="text-indigo-600">
        <span className="text-indigo-600">Theme </span>
        <FontAwesomeIcon icon={theme === "light" ? solidSun : solidMoon} />
      </button>
    </div>
  );
};

export default Theme;
