// RightSection.jsx

import React, { useEffect, useState } from "react";
import Favorith from "../../components/pages/favorite/Favorith";
import HomePage from "../../components/pages/homePage/HomePage";
import Setting from "../../components/pages/setting/Setting";
import Profile from "../../components/pages/profile/Profile";
import Search from "../../components/pages/search/Search";
import Create from "../../components/pages/create/Create";
import Dashboard from "../../components/pages/admin/dashboard/Dashboard";
import AllUser from "../../components/pages/admin/user/AllUser";
import FileManager from "../../components/pages/admin/user/FileManager";
import ViewDetailPodcast from "../../components/pages/viewDetailPodcast/ViewDetailPodcast";
import UpdatePodcast from "../../components/pages/create/UpdatePodcast";
import { useLocation } from "react-router-dom";

const RightSection = ({ onPodcastSelected , file}) => {
  // let content;
  const location = useLocation();
  const [content, setContent] = useState(null);

  useEffect(() => { 

  switch (location.pathname) {
    case "/":
      setContent (<HomePage onPodcastSelected={onPodcastSelected} />) 
      break;
    case "/search":
      setContent (<Search onPodcastSelected={onPodcastSelected} />)
      break;
    case "/favorite":
      setContent (<Favorith onPodcastSelected={onPodcastSelected} />)
      break;
    case "/create":
      setContent (<Create />)
      break;
    case "/profile":
      setContent (<Profile onPodcastSelected={onPodcastSelected} />)
      break;
    case "/setting":
      setContent (<Setting />)
      break;
    case "/dashboard":
      setContent (<Dashboard />)
      break;
    case "/all-user":
      setContent (<AllUser />)
      break;
    case "/all-user-upload":
      setContent (<FileManager />)
      break;
    case "/watch-podcast":
      setContent (<ViewDetailPodcast file={file} onPodcastSelected={onPodcastSelected} />)
      break;
    case "/update-podcast":
      setContent (<UpdatePodcast file={file} onPodcastSelected={onPodcastSelected} />)
      break;
    default:
      setContent (<HomePage onPodcastSelected={onPodcastSelected} />)
  }
}, [location.pathname, file, onPodcastSelected]);
  return (
    <div className="right-section md:p-0">
      <div className="content-container">{content}</div>
    </div>
  );
};

export default RightSection;
