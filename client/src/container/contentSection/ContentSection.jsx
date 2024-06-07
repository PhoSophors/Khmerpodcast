import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import PublicProfile from "../../components/pages/profile/PublicProfile";
import HomePage from "../../components/pages/homePage/HomePage";
import Search from "../../components/pages/search/Search";
import Favorith from "../../components/pages/favorite/Favorith";
import Create from "../../components/pages/create/Create";
import Profile from "../../components/pages/profile/Profile";
import Setting from "../../components/pages/setting/Setting";
import Dashboard from "../../components/pages/admin/dashboard/Dashboard";
import AllUser from "../../components/pages/admin/user/AllUser";
import FileManager from "../../components/pages/admin/user/FileManager";
import UpdatePodcast from "../../components/pages/create/UpdatePodcast";
import ViewDetailPodcast from "../../components/pages/viewDetailPodcast/ViewDetailPodcast";
import EditProfile from "../../components/pages/profile/EditProfile";

const RightSection = ({
  onPodcastSelected,
  onUpdateProfile,
  selectedPodcast,
}) => {
  const location = useLocation();
  const { id } = useParams();

  const content = useMemo(() => {
    if (location.pathname.startsWith("/watch-podcast/")) {
      return <ViewDetailPodcast onUpdatePodcast={onPodcastSelected} />;
    } 
    else if (location.pathname.startsWith("/update-profile/")) {
      return <EditProfile onUpdateProfile={onUpdateProfile} />;
    } else if (location.pathname.startsWith("/public-profile/")) {
      return <PublicProfile onPodcastSelected={onPodcastSelected} />;
    }
    else {
      switch (location.pathname) {
        case "/":
          return <HomePage onPodcastSelected={onPodcastSelected} />;
        case "/search":
          return <Search onPodcastSelected={onPodcastSelected} />;
        case "/favorite":
          return <Favorith onPodcastSelected={onPodcastSelected} />;
        case "/create":
          return <Create />;
        case "/profile":
          return <Profile onPodcastSelected={onPodcastSelected} />;
        case "/setting":
          return <Setting />;
        case "/dashboard":
          return <Dashboard />;
        case "/all-user":
          return <AllUser />;
        case "/all-user-upload":
          return <FileManager />;
        case `/watch-podcast/${selectedPodcast?._id}`:
          return <ViewDetailPodcast onUpdatePodcast={onPodcastSelected} />;
        case "/update-podcast":
          return (
            <UpdatePodcast
              file={selectedPodcast}
              onPodcastSelected={onPodcastSelected}
            />
          );
        case `/update-profile/${id}`:
          return <EditProfile onUpdateProfile={onUpdateProfile} />;
        default:
          return null;
      }
    }
  }, [location.pathname, selectedPodcast, onPodcastSelected, onUpdateProfile, id]);

  return (
    <div className="right-section md:p-0">
      <div className="content-container">{content}</div>
    </div>
  );
};

export default RightSection;
