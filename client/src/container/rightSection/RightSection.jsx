import React, { useEffect, useState, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";

const Favorith = lazy(() => import("../../components/pages/favorite/Favorith"));
const HomePage = lazy(() => import("../../components/pages/homePage/HomePage"));
const Setting = lazy(() => import("../../components/pages/setting/Setting"));
const Profile = lazy(() => import("../../components/pages/profile/Profile"));
const Search = lazy(() => import("../../components/pages/search/Search"));
const Create = lazy(() => import("../../components/pages/create/Create"));
const Dashboard = lazy(() => import("../../components/pages/admin/dashboard/Dashboard"));
const AllUser = lazy(() => import("../../components/pages/admin/user/AllUser"));
const FileManager = lazy(() => import("../../components/pages/admin/user/FileManager"));
const UpdatePodcast = lazy(() => import("../../components/pages/create/UpdatePodcast"));
const ViewDetailPodcast = lazy(() => import("../../components/pages/viewDetailPodcast/ViewDetailPodcast"));


const RightSection = ({ onPodcastSelected, file }) => {
  const location = useLocation();
  const [content, setContent] = useState(null);

  useEffect(() => {
    switch ( location.pathname ) {
      case "/":
        setContent(<HomePage onPodcastSelected={onPodcastSelected} />);
        break;
      case "/search":
        setContent(<Search onPodcastSelected={onPodcastSelected} />);
        break;
      case "/favorite":
        setContent(<Favorith onPodcastSelected={onPodcastSelected} />);
        break;
      case "/create":
        setContent(<Create />);
        break;
      case "/profile":
        setContent(<Profile onPodcastSelected={onPodcastSelected} />);
        break;
      case "/setting":
        setContent(<Setting />);
        break;
      case "/dashboard":
        setContent(<Dashboard />);
        break;
      case "/all-user":
        setContent(<AllUser />);
        break;
      case "/all-user-upload":
        setContent(<FileManager />);
        break;
      case `/watch-podcast/${file?._id}`:
        setContent(<ViewDetailPodcast file={file} onPodcastSelected={onPodcastSelected} />);
        break;
      case "/update-podcast":
        setContent(<UpdatePodcast file={file} onPodcastSelected={onPodcastSelected} />);
        break;
      default:
        setContent(<HomePage onPodcastSelected={onPodcastSelected} />);
        break;
    }
  }, [location.pathname, file, onPodcastSelected]);

  return (
    <div className="right-section md:p-0">
      <div className="content-container">
        <Suspense >
          {content}
        </Suspense>
      </div>
    </div>
  );
};

export default RightSection;
