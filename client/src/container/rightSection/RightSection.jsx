import React, { useEffect, useState, lazy } from "react";
import { useLocation, useParams } from "react-router-dom";
import PublicProfile from "../../components/pages/profile/PublicProfile";

// Lazy load components
const Favorith = lazy(() => import("../../components/pages/favorite/Favorith"));
const HomePage = lazy(() => import("../../components/pages/homePage/HomePage"));
const Setting = lazy(() => import("../../components/pages/setting/Setting"));
const Profile = lazy(() => import("../../components/pages/profile/Profile"));
const Search = lazy(() => import("../../components/pages/search/Search"));
const Create = lazy(() => import("../../components/pages/create/Create"));
const Dashboard = lazy(() =>
  import("../../components/pages/admin/dashboard/Dashboard")
);
const AllUser = lazy(() => import("../../components/pages/admin/user/AllUser"));
const FileManager = lazy(() =>
  import("../../components/pages/admin/user/FileManager")
);
const UpdatePodcast = lazy(() =>
  import("../../components/pages/create/UpdatePodcast")
);
const ViewDetailPodcast = lazy(() =>
  import("../../components/pages/viewDetailPodcast/ViewDetailPodcast")
);
const EditProfile = lazy(() =>
  import("../../components/pages/profile/EditProfile")
);

const RightSection = ({
  onPodcastSelected,
  onUpdateProfile,
  selectedPodcast,
}) => {
  const location = useLocation();
  const [content, setContent] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (location.pathname.startsWith("/watch-podcast/")) {
      setContent(<ViewDetailPodcast onUpdatePodcast={onPodcastSelected} />);
    } 
    else if (location.pathname.startsWith("/update-profile/")) {
      setContent(<EditProfile onUpdateProfile={onUpdateProfile} />);
    } else if (location.pathname.startsWith("/public-profile/")) {
      setContent(<PublicProfile onPodcastSelected={onPodcastSelected} />);
    }
    else {
      switch (location.pathname) {
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
        case `/watch-podcast/${selectedPodcast?._id}`:
          setContent(<ViewDetailPodcast onUpdatePodcast={onPodcastSelected} />);
          break;
        case "/update-podcast":
          setContent(
            <UpdatePodcast
              file={selectedPodcast}
              onPodcastSelected={onPodcastSelected}
            />
          );
          break;
        case `/update-profile/${id}`:
          setContent(<EditProfile onUpdateProfile={onUpdateProfile} />);
          break;
        default:
          break;
      }
    }
  }, [
    location.pathname,
    selectedPodcast,
    onPodcastSelected,
    onUpdateProfile,
    id,
  ]);

  return (
    <div className="right-section md:p-0">
      <div className="content-container">{content}</div>
    </div>
  );
};

export default RightSection;
