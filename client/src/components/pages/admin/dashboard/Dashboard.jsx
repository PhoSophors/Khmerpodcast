import "../admin.css";
import TotalUser from "./dashbaordComponent/TotalUser";
import TotalPodcast from "./dashbaordComponent/TotalPodcast";
import TotalPodcastStorage from "./dashbaordComponent/TotalPodcastStorage";
import TotalProfileStorage from "./dashbaordComponent/TotalProfileStorage";
import TotalCloudStorage from "./dashbaordComponent/TotalCloudStorage";

const Dashboard = () => {
  return (
    <>
      <div className="flex grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 md:flex sm:gap-5 p-2">
        <TotalUser />
        <TotalPodcast />
        <TotalCloudStorage />
      </div>

      <div className="flex grid xl:grid-cols-2 grid-cols-1 gap-4 gap-2 sm:flex sm:gap-5 p-2">
        <TotalProfileStorage />
        <TotalPodcastStorage />
      </div>
    </>
  );
};

export default Dashboard;
