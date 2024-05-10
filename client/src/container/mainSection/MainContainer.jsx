import React from "react";
import Header from "../../components/header/Header";
import "./maincontainer.css";
import SideMenu from "../../components/sidemenu/SideMenu";
import HomePage from "../../components/pages/homePage/HomePage";

const MainContainer = () => {
  return (
    <div className="main-container">
      <div className="side-menu-container">
        <SideMenu />
      </div>
      <div className="content-container">
        <Header />
        {/* Render other components or pages here */}
        <HomePage />
      </div>
    </div>
  );
};

export default MainContainer;
