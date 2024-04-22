// RightSection component
import React from "react";
import Favorith from "../../components/pages/favorite/Favorith";
import HomePage from "../../components/pages/homePage/HomePage";
import Setting from "../../components/pages/setting/Setting";
import Profile from "../../components/pages/profile/Profile";
import Search from "../../components/pages/search/Search";
import Create from "../../components/pages/create/Create";
import Dashboard from "../../components/pages/admin/dashboard/Dashboard";
import AllUser from "../../components/pages/admin/user/AllUser";
import FileManager from "../../components/pages/admin/user/FileManager";

const RightSection = ({ selectedMenuItem }) => {
  let content = "";

  // Render different content based on the selected menu item
  switch (selectedMenuItem) {
    case "/":
      content = <HomePage />;
      break;
    case "/search":
      content = <Search />;
      break;
    case "/favorite":
      content = <Favorith />;
      break;
    case "/create":
      content = <Create />;
      break;

    case "/profile":
      content = <Profile />;
      break;
    case "/setting":
      content = <Setting />;
      break;
    case "/dashboard":
      content = <Dashboard />;
      break;
    case "/all-user":
      content = <AllUser />;
      break;
    case "/all-user-upload":
      content = <FileManager />;
      break;

      
    default:
      content = "No Content";
  }

  return (
    <div className="right-section md:p-0 h-full">
      <div className="content-container">{content}</div>
    </div>
  );
};

export default RightSection;
