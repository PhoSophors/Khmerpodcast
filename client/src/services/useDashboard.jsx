import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { api_url } from "../api/config";

const useDashboard = (selectedDate) => {
  const [userCount, setUserCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [podcastStorageInfo, setPodcastStorageInfo] = useState({
    totalSize: 0,
    totalObjects: 0,
  });
  const [profileStorageInfo, setProfileStorageInfo] = useState({
    totalSize: 0,
    totalObjects: 0,
  });

  const authToken = Cookies.get("authToken")
    ? atob(Cookies.get("authToken"))
    : null;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (authToken) {
          // Fetch user count
          const userResponse = await axios.get(`${api_url}/admin/users-count`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            params: { date: selectedDate },
          });
          setUserCount(userResponse.data.user);

          // Fetch file count
          const fileResponse = await axios.get(`${api_url}/files/count`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            params: { date: selectedDate },
          });
          setFileCount(fileResponse.data.count);

          const podcastStorage = await axios.get(
            `${api_url}/admin/podcast-storage-info`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setPodcastStorageInfo(podcastStorage.data); 

          const profileStorage = await axios.get(
            `${api_url}/admin/profile-storage-info`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setProfileStorageInfo(profileStorage.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, [selectedDate, authToken]);

  return { userCount, fileCount, podcastStorageInfo, profileStorageInfo };
};

export default useDashboard;
